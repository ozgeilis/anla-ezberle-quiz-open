-- SYNTHETIC, NON-RELIGIOUS development fixtures only. No import of draft bank.
-- Run only against an explicitly authorized development database.
-- Immutable versions: rerunning this seed preserves existing rows.
insert into quiz_private.quiz_questions(id,version,prompt,options,content_scope)
select 'synthetic-v1-'||lpad(n::text,2,'0'),1,
  '[Sentetik test] '||n||' + 2 kaçtır?',
  (select jsonb_agg(jsonb_build_object('id',chr(97+i),'text',(n+2+((i-(n%4)+4)%4))::text) order by i) from generate_series(0,3) i),
  'synthetic_test'
from generate_series(1,20) n on conflict do nothing;
insert into quiz_private.quiz_answer_keys(question_id,question_version,correct_option_id,explanation)
select 'synthetic-v1-'||lpad(n::text,2,'0'),1,chr(97+n%4),
  'Bu dinî olmayan sentetik test sorusunda '||n||' + 2 = '||(n+2)||'.'
from generate_series(1,20) n on conflict do nothing;
