-- Stops new automatic enrollment; existing enabled accounts keep their access.
update quiz_private.player_service_config
set public_enrollment_enabled=false where singleton;
