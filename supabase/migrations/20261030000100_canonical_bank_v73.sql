-- Requires 20261027000100_canonical_bank_v72.sql. No staging or switch change.
-- The product owner authorized v73 activation on 2026-10-30; this migration
-- does not claim independent theological review or alter old question versions.
BEGIN;
SET LOCAL lock_timeout='5s';
ALTER TABLE quiz_private.quiz_questions DROP CONSTRAINT quiz_questions_content_scope_check;
ALTER TABLE quiz_private.quiz_questions ADD CONSTRAINT quiz_questions_content_scope_check CHECK(content_scope IN('synthetic_test','owner_approved_v13','bank-v72','bank-v73'));
ALTER TABLE quiz_private.matches DROP CONSTRAINT matches_content_scope_check;
ALTER TABLE quiz_private.matches ADD CONSTRAINT matches_content_scope_check CHECK(content_scope IN('synthetic_test','owner_approved_v13','bank-v72','bank-v73'));
ALTER TABLE quiz_private.online_content_config DROP CONSTRAINT online_content_config_active_scope_check;
ALTER TABLE quiz_private.online_content_config ADD CONSTRAINT online_content_config_active_scope_check CHECK(active_scope IN('synthetic_test','owner_approved_v13','bank-v72','bank-v73'));
ALTER TABLE quiz_private.online_bank_members DROP CONSTRAINT online_bank_members_dataset_check;
ALTER TABLE quiz_private.online_bank_members ADD CONSTRAINT online_bank_members_dataset_check CHECK(dataset IN('bank-v72','bank-v73'));
ALTER TABLE quiz_private.bank_release_approval DROP CONSTRAINT bank_release_approval_dataset_check;
ALTER TABLE quiz_private.bank_release_approval ADD CONSTRAINT bank_release_approval_dataset_check CHECK(dataset IN('bank-v72','bank-v73'));
INSERT INTO quiz_private.bank_release_approval(dataset,content_approved) VALUES('bank-v73',false);
CREATE OR REPLACE FUNCTION quiz_private.live_validate_dataset(ds text) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE p quiz_private.live_pools;q quiz_private.live_questions;used text[]; k text; counts jsonb; n integer;
BEGIN
 IF (SELECT count(*) FROM quiz_private.live_questions WHERE dataset=ds)<>(CASE WHEN ds IN('bank-v72','bank-v73') THEN 1500 ELSE 600 END) OR (SELECT count(*) FROM quiz_private.live_keys WHERE dataset=ds)<>(CASE WHEN ds IN('bank-v72','bank-v73') THEN 1500 ELSE 600 END) OR (SELECT count(*) FROM quiz_private.live_pools WHERE dataset=ds)<>264 THEN RAISE EXCEPTION 'Incomplete live dataset'; END IF;
 IF EXISTS(SELECT 1 FROM quiz_private.live_questions qq JOIN quiz_private.live_keys a USING(dataset,id) WHERE qq.dataset=ds AND NOT EXISTS(SELECT 1 FROM jsonb_array_elements(qq.question->'options') o WHERE o->>'id'=a.correct_option)) THEN RAISE EXCEPTION 'Invalid live answer key'; END IF;
 FOR p IN SELECT * FROM quiz_private.live_pools WHERE dataset=ds LOOP
  IF ds IN('bank-v72','bank-v73') AND (
   jsonb_array_length(p.candidates)<>(SELECT count(*) FROM quiz_private.live_questions v WHERE v.dataset=ds AND (p.topic='mixed' OR v.topic=p.topic) AND (p.quotas->>v.difficulty)::integer>0)
   OR EXISTS(SELECT 1 FROM jsonb_array_elements_text(p.candidates) candidate_id WHERE NOT EXISTS(SELECT 1 FROM quiz_private.live_questions v WHERE v.dataset=ds AND v.id=candidate_id AND (p.topic='mixed' OR v.topic=p.topic) AND (p.quotas->>v.difficulty)::integer>0))
   OR jsonb_array_length(p.candidates)<>(SELECT count(DISTINCT v) FROM jsonb_array_elements_text(p.candidates) v)
  ) THEN RAISE EXCEPTION 'Invalid canonical live candidate pool';END IF;
  IF jsonb_array_length(p.sample)=0 THEN CONTINUE;END IF;
  IF jsonb_array_length(p.sample)<>p.question_count THEN RAISE EXCEPTION 'Invalid live witness';END IF;
  used='{}';counts='{"easy":0,"medium":0,"hard":0}';n=0;
  FOR k IN SELECT jsonb_array_elements_text(p.sample) LOOP
   SELECT * INTO q FROM quiz_private.live_questions WHERE dataset=ds AND id=k;
   IF NOT FOUND OR (p.topic<>'mixed' AND q.topic<>p.topic) OR q.concept_keys && used OR NOT(p.candidates ? k) THEN RAISE EXCEPTION 'Invalid independent live witness';END IF;
   used=used||q.concept_keys;counts=jsonb_set(counts,ARRAY[q.difficulty],to_jsonb((counts->>q.difficulty)::integer+1));n=n+1;
  END LOOP;
  IF counts<>p.quotas OR n<>p.question_count THEN RAISE EXCEPTION 'Invalid live quotas';END IF;
 END LOOP;
END $$;

CREATE OR REPLACE FUNCTION quiz_private.validate_online_bank(ds text) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
BEGIN
 IF ds NOT IN('bank-v72','bank-v73') OR (SELECT count(*) FROM quiz_private.online_bank_members WHERE dataset=ds)<>1500
 THEN RAISE EXCEPTION 'Incomplete canonical bank membership'; END IF;
 IF EXISTS(
 SELECT 1 FROM quiz_private.online_bank_members m
 JOIN quiz_private.quiz_questions q ON q.id=m.id AND q.version=m.version
 LEFT JOIN quiz_private.quiz_answer_keys k ON k.question_id=m.id AND k.question_version=m.version
 WHERE m.dataset=ds AND (m.metadata->>'id'<>m.id OR (m.metadata->>'version')::integer<>m.version
 OR m.metadata->>'question' IS DISTINCT FROM q.prompt
 OR m.metadata->>'explanation' IS DISTINCT FROM k.explanation
 OR m.metadata->>'reviewStatus'<>'approved' OR jsonb_array_length(m.metadata->'sources')<1
 OR q.options IS DISTINCT FROM (SELECT jsonb_agg(jsonb_build_object('id',chr(96+o.ordinality::integer),'text',o.value->>'text') ORDER BY o.ordinality) FROM jsonb_array_elements(m.metadata->'options') WITH ORDINALITY o(value,ordinality))
 OR k.correct_option_id IS DISTINCT FROM (SELECT chr(96+o.ordinality::integer) FROM jsonb_array_elements(m.metadata->'options') WITH ORDINALITY o(value,ordinality) WHERE o.value->>'id'=m.metadata->>'correctOptionId')))
 THEN RAISE EXCEPTION 'Canonical async projection/key mismatch'; END IF;
END $$;

-- Preserve the historical selector and its original synthetic/v13 behavior.
-- Existing legacy selector and canonical v72 history remain unchanged.
CREATE OR REPLACE FUNCTION quiz_private.async_manifest_recent(scope text,player uuid) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE candidate record; used text[]='{}';picked jsonb='[]';
BEGIN
 IF scope NOT IN('bank-v72','bank-v73') THEN RETURN quiz_private.async_manifest_recent_legacy(scope,player); END IF;
 PERFORM pg_advisory_xact_lock(hashtextextended('async-history:'||player::text,0));
 -- Keep the existing last-five-match rotation, including history across versions.
 -- Prefer unseen IDs; overlapping concepts can never enter the same manifest.
 FOR candidate IN
 WITH recent AS (
  SELECT m.question_set,row_number() OVER(ORDER BY m.created_at DESC,m.id DESC) age
  FROM quiz_private.matches m JOIN quiz_private.match_players p ON p.match_id=m.id
  WHERE p.player_id=player ORDER BY m.created_at DESC,m.id DESC LIMIT 5
 ), usage AS (
  SELECT item->>'id' id,count(*) seen,min(age) age FROM recent,
  LATERAL jsonb_array_elements(question_set) item GROUP BY item->>'id'
 )
 SELECT b.*,q.prompt,q.options FROM quiz_private.online_bank_members b
 JOIN quiz_private.quiz_questions q ON q.id=b.id AND q.version=b.version
 LEFT JOIN usage u ON u.id=b.id WHERE b.dataset=scope
 ORDER BY coalesce(u.seen,0),coalesce(u.age,999) DESC,random()
 LOOP
  IF NOT(candidate.concept_keys && used) THEN
   picked=picked||jsonb_build_array(jsonb_build_object('id',candidate.id,'version',candidate.version,'prompt',candidate.prompt,'options',candidate.options));
   used=used||candidate.concept_keys;
   IF jsonb_array_length(picked)=10 THEN RETURN picked; END IF;
  END IF;
 END LOOP;
 RETURN NULL; -- Never silently widen to retired/v13 questions.
END $$;

-- Explicit owner publication permission is separate from technical integrity and expert review. No value
-- is enabled here. Both switches fail closed until an explicit operator approval.
CREATE OR REPLACE FUNCTION quiz_private.guard_online_content_config() RETURNS trigger
LANGUAGE plpgsql SET search_path='' AS $$
BEGIN
 IF new.active_scope IN('bank-v72','bank-v73') THEN
  PERFORM quiz_private.validate_online_bank(new.active_scope);
  IF NOT coalesce((SELECT content_approved FROM quiz_private.bank_release_approval WHERE dataset=new.active_scope),false)
  THEN RAISE EXCEPTION 'Explicit content release approval required'; END IF;
 ELSIF new.active_scope='owner_approved_v13' AND (SELECT count(*) FROM quiz_private.quiz_questions q JOIN quiz_private.quiz_answer_keys k ON k.question_id=q.id AND k.question_version=q.version WHERE q.content_scope=new.active_scope)<>500
 THEN RAISE EXCEPTION '500 complete historical v13 questions required'; END IF;
 RETURN new;
END $$;
CREATE OR REPLACE FUNCTION quiz_private.guard_live_bank_activation() RETURNS trigger
LANGUAGE plpgsql SET search_path='' AS $$
BEGIN
 IF new.dataset IN('bank-v72','bank-v73') AND new.enabled THEN
  PERFORM quiz_private.live_validate_dataset(new.dataset);
  PERFORM quiz_private.validate_online_bank(new.dataset);
  IF NOT coalesce((SELECT content_approved FROM quiz_private.bank_release_approval WHERE dataset=new.dataset),false)
  THEN RAISE EXCEPTION 'Explicit content release approval required'; END IF;
  IF EXISTS(SELECT 1 FROM quiz_private.live_questions l LEFT JOIN quiz_private.online_bank_members b ON b.dataset=l.dataset AND b.id=l.id WHERE l.dataset=new.dataset AND (b.id IS NULL OR b.version<>l.version OR l.question->>'prompt' IS DISTINCT FROM b.metadata->>'question' OR l.question->'options' IS DISTINCT FROM b.metadata->'options' OR l.difficulty<>b.metadata->>'difficulty' OR l.concept_keys<>b.concept_keys OR NOT EXISTS(SELECT 1 FROM quiz_private.live_keys k WHERE k.dataset=l.dataset AND k.id=l.id AND k.correct_option=b.metadata->>'correctOptionId' AND k.explanation=b.metadata->>'explanation' AND k.sources=b.metadata->'sources')))
  THEN RAISE EXCEPTION 'Live and async canonical datasets differ'; END IF;
 END IF;
 RETURN new;
END $$;
REVOKE ALL ON FUNCTION quiz_private.validate_online_bank(text),quiz_private.guard_live_bank_activation(),quiz_private.async_manifest_recent(text,uuid) FROM public,anon,authenticated;
GRANT EXECUTE ON FUNCTION quiz_private.async_manifest_recent(text,uuid) TO service_role;
COMMIT;
