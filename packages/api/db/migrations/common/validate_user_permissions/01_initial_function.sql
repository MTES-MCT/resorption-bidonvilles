CREATE OR REPLACE FUNCTION validate_user_permissions() RETURNS trigger AS $validate_user_permissions$
    DECLARE
        nb_of_attachments number;
    BEGIN
        -- on récupère le nombre d'attachments rattachés à la permission
        SELECT COUNT(*) INTO nb_of_attachments
        FROM user_permission_attachments
        WHERE user_permission_attachments.fk_user_permission = NEW.user_permission_id;

        -- on s'assure que si la permission passe en allowed=false, alors il n'y a pas d'attachment
        IF allowed IS FALSE AND nb_of_attachments > 0 THEN
            RAISE EXCEPTION 'veuillez supprimer les attachments de cette permission avant de la passer en allowed=false';
        END IF;

        -- on s'assure que si la permission passe en allow_all=true, alors il n'y a pas d'attachment
        IF allow_all IS TRUE AND nb_of_attachments > 0 THEN
            RAISE EXCEPTION 'veuillez supprimer les attachments de cette permission avant de la passer en allow_all = true';
        END IF;

        -- on ne peut pas modifier la colonne entity
        CASE
            WHEN entity IN ('shantytown', 'shantytown_comment', 'shantytown_justice', 'shantytown_owner', 'shantytown_actor')
            THEN
                IF NEW.fk_plan IS NOT NULL THEN
                    RAISE EXCEPTION 'on ne peut pas rattacher un dispositif à une permission de type %', entity;
                END IF;

            WHEN entity IN ('plan', 'plan_finances')
            THEN
                IF NEW.fk_shantytown IS NOT NULL THEN
                    RAISE EXCEPTION 'on ne peut pas rattacher un site à une permission de type %', entity;
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