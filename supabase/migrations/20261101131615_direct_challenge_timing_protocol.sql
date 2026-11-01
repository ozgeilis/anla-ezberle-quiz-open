BEGIN;
SET LOCAL lock_timeout='5s';
-- Forward-only correction: preserve the deployed matchmaking function, ACL and
-- all existing invitations/matches. Only a new acceptance negotiates timing v2.
DO $$
DECLARE original text;patched text;
needle constant text=$old$result=public.online_duel_command(c.sender,'create',jsonb_build_object('requestId',c.match_request_id));$old$;
replacement constant text=$new$if body->>'timingVersion' IS DISTINCT FROM '2' then return quiz_private.failure('UPDATE_REQUIRED',409); end if;
   result=public.online_duel_command(c.sender,'create',jsonb_build_object('requestId',c.match_request_id,'timingVersion',2));$new$;
BEGIN
 IF (SELECT md5(prosrc) FROM pg_proc WHERE oid='public.player_matchmaking_command(uuid,text,jsonb)'::regprocedure)<>'cf3e39c0494f8260131ea3e08eb15d00' THEN
  RAISE EXCEPTION 'Matchmaking source drift: review direct challenge timing correction';
 END IF;
 SELECT pg_get_functiondef('public.player_matchmaking_command(uuid,text,jsonb)'::regprocedure) INTO original;
 IF (length(original)-length(replace(original,needle,'')))/length(needle)<>1 THEN
  RAISE EXCEPTION 'Expected one direct challenge match creation';
 END IF;
 patched=replace(original,needle,replacement);
 EXECUTE patched;
END $$;
COMMIT;
