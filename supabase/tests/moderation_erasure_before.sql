-- Only the disposable schema-copy runner uses this pre-migration fixture.
INSERT INTO auth.users(id,email,email_confirmed_at,is_anonymous)
VALUES('e0000000-0000-4000-8000-000000000001','erasure-repair@example.invalid',now(),false);
INSERT INTO quiz_private.player_reports(id,reporter,target,reason,details,name_snapshot,username_snapshot)
VALUES('e0000000-0000-4000-8000-000000000002',NULL,'e0000000-0000-4000-8000-000000000001','other','Old private details','Old private name','old_private_name');
INSERT INTO quiz_private.moderation_audit(id,moderator,report,target,decision,note)
VALUES('e0000000-0000-4000-8000-000000000003','e0000000-0000-4000-8000-000000000001','e0000000-0000-4000-8000-000000000002','e0000000-0000-4000-8000-000000000001','restrict','Old private audit');
INSERT INTO quiz_private.social_restrictions(actor,reason)
VALUES('e0000000-0000-4000-8000-000000000001','Old private audit');
