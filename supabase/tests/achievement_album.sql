-- Single statement so both CLI remote query and local psql can execute it.
-- The inner subtransaction ALWAYS rolls back every fixture, including awards.
do $$
declare actor uuid=gen_random_uuid(); players uuid[]='{}'; other uuid; unverified uuid=gen_random_uuid();
 manifest jsonb; mid uuid; sid uuid; i integer; j integer; result jsonb; before_scores bigint;
begin
 select count(*) into before_scores from quiz_private.score_ledger;
 begin
  assert (select count(*) from quiz_private.achievement_rules)=6,'six server rules';
  assert not has_function_privilege('authenticated','public.player_achievement_command(uuid,text,jsonb)','EXECUTE'),'service-only RPC';
  assert not has_table_privilege('authenticated','quiz_private.achievement_awards','INSERT'),'no client awards';
  assert (select relforcerowsecurity from pg_class where oid='quiz_private.achievement_awards'::regclass),'forced RLS';
  insert into auth.users(id,email,email_confirmed_at,is_anonymous) values(actor,'achievement-'||actor||'@example.com',now(),false),(unverified,'achievement-'||unverified||'@example.com',null,false);
  insert into quiz_private.player_profiles(id,display_name,username,access_enabled) values(actor,'Album Test','album_'||left(replace(actor::text,'-',''),10),true),(unverified,'Unverified Test','album_'||left(replace(unverified::text,'-',''),10),true);
  assert public.player_achievement_command(unverified,'achievement_self','{}')->>'error'='SIGN_IN_REQUIRED','unverified cannot fetch';
  for i in 1..5 loop
   other=gen_random_uuid();players=array_append(players,other);
   insert into auth.users(id,email,email_confirmed_at,is_anonymous) values(other,'achievement-'||other||'@example.com',now(),false);
   insert into quiz_private.player_profiles(id,display_name,username,access_enabled) values(other,'Opponent Test','album_'||left(replace(other::text,'-',''),10),true);
  end loop;
  result=public.player_achievement_command(actor,'achievement_self','{}');
  assert result->'earned'='[]'::jsonb,'new profile has no fake awards';
  result=public.player_achievement_command(actor,'achievement_settings','{"shared":true,"showcase":["topic_quran_diamond"]}');
  assert result->>'error'='INVALID_BADGE','local claim cannot publish';
  insert into quiz_private.friendships(sender,recipient,state) values(actor,players[1],'pending');
  assert not exists(select 1 from quiz_private.achievement_awards where player_id=actor),'pending friendship not enough';
  update quiz_private.friendships set state='accepted' where sender=actor and recipient=players[1];
  assert exists(select 1 from quiz_private.achievement_awards where player_id=actor and badge_id='friend_first'),'accepted friendship awards';
  for i in 2..5 loop insert into quiz_private.friendships(sender,recipient,state) values(actor,players[i],'accepted');end loop;
  assert exists(select 1 from quiz_private.achievement_awards where player_id=actor and badge_id='friend_five'),'five accepted friends';
  delete from quiz_private.friendships where sender=actor;
  assert (select count(*) from quiz_private.achievement_awards where player_id=actor)=2,'awards do not disappear on removal';
  assert quiz_private.social_player(actor)->'badgeIds'='[]'::jsonb,'hidden by default';
  result=public.player_achievement_command(actor,'achievement_settings','{"shared":true,"showcase":["friend_first"]}');
  assert result->>'shared'='true','opt-in works';
  assert quiz_private.social_player(actor)->'badgeIds' ? 'friend_first','public verified award';
  assert quiz_private.social_player(actor)->'showcase'='["friend_first"]'::jsonb,'public showcase matches owner choice';
  result=public.player_achievement_command(actor,'achievement_settings','{"shared":true,"showcase":["friend_first","friend_first"]}');
  assert result->>'error'='INVALID_BADGE','duplicate showcase rejected';
  result=public.player_achievement_command(actor,'achievement_settings','{"shared":false,"showcase":["friend_first"]}');
  assert quiz_private.social_player(actor)->'badgeIds'='[]'::jsonb and quiz_private.social_player(actor)->'showcase'='[]'::jsonb,'privacy hides all award details';
  select jsonb_agg(jsonb_build_object('id',id,'version',version,'options',options)) into manifest from(select * from quiz_private.quiz_questions limit 10) q;
  for i in 1..9 loop
   -- First five matches use one opponent; final four introduce distinct opponents.
   other=players[case when i<=5 then 1 else i-4 end];mid=gen_random_uuid();
   insert into quiz_private.matches(id,creator_id,create_request_id,question_set,manifest_hash,invite_hash,state) values(mid,actor,gen_random_uuid(),manifest,'achievement-test',decode(md5(mid::text),'hex'),'in_progress');
   for j in 1..2 loop
    sid=gen_random_uuid();
    insert into quiz_private.quiz_sessions(id,match_id,player_id,started_at,completed_at,correct_count) values(sid,mid,case when j=1 then actor else other end,now()-interval '1 minute',now(),case when j=1 then 10 else 9 end);
    insert into quiz_private.match_players(match_id,slot,player_id,session_id) values(mid,case when j=1 then 'a' else 'b' end,case when j=1 then actor else other end,sid);
   end loop;
   insert into quiz_private.score_ledger(match_id,player_id,score,rule_version) values(mid,actor,1000,1),(mid,other,900,1);
   if i=1 then assert not exists(select 1 from quiz_private.achievement_awards where player_id=actor and badge_id='duel_first'),'unfinished match never awards';end if;
   update quiz_private.matches set state='completed' where id=mid;
   if i=5 then assert not exists(select 1 from quiz_private.achievement_awards where player_id=actor and badge_id='duel_five'),'same opponent cannot farm five-opponent badge';end if;
  end loop;
  result=public.player_achievement_command(actor,'achievement_self','{}');
  assert jsonb_array_length(result->'earned')=6,'six earned server awards';
  perform quiz_private.refresh_achievement_awards(actor);
  assert (select count(*) from quiz_private.achievement_awards where player_id=actor)=6,'idempotent awards';
  assert result->'metrics'->>'opponents'='5','five distinct opponents';
  assert result->'metrics'->>'wins'='5','distinct win opponents';
  -- Exercise the level cap without changing an existing player's score ledger.
  for i in 1..250 loop
   mid=gen_random_uuid();
   insert into quiz_private.matches(id,creator_id,create_request_id,question_set,manifest_hash,invite_hash,state) values(mid,actor,gen_random_uuid(),manifest,'achievement-cap',decode(md5(mid::text),'hex'),'in_progress');
   insert into quiz_private.score_ledger(match_id,player_id,score,rule_version) values(mid,actor,1000,1);
  end loop;
  -- Total XP is preserved above the cap; only the visible level is bounded.
  assert (quiz_private.social_player(actor)->>'xp')::integer=25900,'online XP formula remains score/10';
  assert (quiz_private.social_player(actor)->>'level')::integer=100,'online level cap';
  raise sqlstate 'P0002' using message='ROLLBACK_ACHIEVEMENT_FIXTURES';
 exception when no_data_found then
  if sqlerrm<>'ROLLBACK_ACHIEVEMENT_FIXTURES' then raise;end if;
 end;
 assert not exists(select 1 from auth.users where id=actor),'all test users rolled back';
 assert (select count(*) from quiz_private.score_ledger)=before_scores,'existing score ledger unchanged';
end $$;
