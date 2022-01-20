CREATE OR REPLACE FUNCTION validate_user_permission_attachments() RETURNS trigger AS $validate_user_permission_attachments$
    DECLARE
        entity varchar;
        allowed boolean;
        allow_all boolean;
    BEGIN
        -- on récupère l'entity concernée par la permission
        SELECT user_permissions.fk_entity, user_permissions.allowed, user_permissions.allow_all
        INTO entity, allowed, allow_all
        FROM user_permissions
        WHERE user_permissions.user_permission_id = NEW.fk_user_permission;

        -- on s'assure que la permission considérée est une permission "allowed"
        IF allowed IS FALSE THEN
            RAISE EXCEPTION 'on ne peut pas associer un attachment à une permission pour laquelle allowed = false';
        END IF;

        -- on s'assure que la permission considérée n'est pas une permission "allow all"
        IF allow_all IS TRUE THEN
            RAISE EXCEPTION 'on ne peut pas associer un attachment à une permission qui donne un accès total (allow_all = true)';
        END IF;

        -- on contrôle la compatibilité entre l'attachment et l'entité de la permission
        CASE
            WHEN entity IN ('shantytown', 'shantytown_comment', 'shantytown_justice', 'shantytown_owner', 'shantytown_actor')
            THEN
                IF NEW.fk_plan IS NOT NULL THEN
                    RAISE EXCEPTION 'on ne peut pas rattacher un dispositif à une permission de type %', entity;
                END IF;

            WHEN entity IN ('plan', 'plan_finances')
            THEN
                IF NEW.fk_shantytown IS NOT NULL OR NEW.fk_city IS NOT NULL OR NEW.fk_epci IS NOT NULL THEN
                    RAISE EXCEPTION 'on ne peut pas rattacher un site, une commune, ou un EPCI à une permission de type %', entity;
                END IF;

            WHEN entity IN ('user', 'covid_comment')
            THEN
                IF NEW.fk_region IS NULL AND NEW.fk_departement IS NULL THEN
                    RAISE EXCEPTION 'on ne peut pas rattacher autre chose qu''une région ou un département à une permission de type %', entity;
                END IF;

            WHEN entity IN ('stats')
            THEN
                IF NEW.fk_departement IS NULL THEN
                    RAISE EXCEPTION 'on ne peut pas rattacher autre chose qu''un département à une permission de type %', entity;
                END IF;

            WHEN entity IN ('contact_form_referral')
            THEN
                IF NEW.fk_shantytown IS NOT NULL OR NEW.fk_plan IS NOT NULL THEN
                    RAISE EXCEPTION 'on ne peut pas rattacher un site ou un dispositif à une permission de type %', entity;
                END IF;

            ELSE
                RAISE EXCEPTION 'entité non supportée : %', entity;
        END CASE;

        RETURN NEW;
    END;
$validate_user_permission_attachments$ LANGUAGE plpgsql;