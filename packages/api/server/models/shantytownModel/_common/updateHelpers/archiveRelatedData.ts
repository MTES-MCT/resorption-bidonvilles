import { sequelize } from '#db/sequelize';
import { Transaction } from 'sequelize';

async function archiveOrigins(hid: number, shantytownId: number, transaction: Transaction): Promise<void> {
    await sequelize.query(
        `INSERT INTO
                "ShantytownOriginHistories"(
                    fk_shantytown,
                    fk_social_origin,
                    created_at,
                    updated_at,
                    "archivedAt"
                )
            SELECT
                :hid,
                fk_social_origin,
                created_at,
                updated_at,
                NOW()
            FROM shantytown_origins WHERE fk_shantytown = :id`,
        {
            replacements: { hid, id: shantytownId },
            transaction,
        },
    );
}

async function archiveToiletTypes(hid: number, shantytownId: number, transaction: Transaction): Promise<void> {
    await sequelize.query(
        `INSERT INTO
                "shantytown_toilet_types_history"(
                    fk_shantytown,
                    toilet_type,
                    created_at,
                    archived_at
                )
            SELECT
                :hid,
                toilet_type::text::"enum_shantytown_toilet_types_history_toilet_type",
                created_at,
                NOW()
            FROM shantytown_toilet_types WHERE fk_shantytown = :id`,
        {
            replacements: { hid, id: shantytownId },
            transaction,
        },
    );
}

async function archiveElectricityTypes(hid: number, shantytownId: number, transaction: Transaction): Promise<void> {
    await sequelize.query(
        `INSERT INTO
            "electricity_access_types_history"(
                fk_shantytown,
                electricity_access_type,
                created_at,
                archived_at
            )
        SELECT
            :hid,
            electricity_access_type::text::"enum_electricity_access_types_history_electricity_access_type",
            created_at,
            NOW()
        FROM electricity_access_types WHERE fk_shantytown = :id`,
        {
            replacements: { hid, id: shantytownId },
            transaction,
        },
    );
}

async function archivePreparatoryPhases(hid: number, shantytownId: number, transaction: Transaction): Promise<void> {
    await sequelize.query(
        `INSERT INTO
            "shantytown_resorption_phases_history"(
                fk_shantytown,
                fk_preparatory_phase,
                created_at,
                completed_at,
                archived_at
            )
        SELECT
            :hid,
            fk_preparatory_phase,
            created_at,
            completed_at,
            NOW()
        FROM shantytown_preparatory_phases_toward_resorption WHERE fk_shantytown = :id`,
        {
            replacements: { hid, id: shantytownId },
            transaction,
        },
    );
}

async function archiveParcelOwners(hid: number, shantytownId: number, transaction: Transaction): Promise<void> {
    await sequelize.query(
        `INSERT INTO
            "shantytown_parcel_owners_history"(
                shantytown_parcel_owner_id,
                fk_shantytown,
                fk_user,
                owner_name,
                fk_owner_type,
                active,
                created_at,
                archived_at
            )
        SELECT
            shantytown_parcel_owner_id,
            :hid,
            fk_user,
            owner_name,
            fk_owner_type,
            active,
            created_at,
            NOW()
        FROM shantytown_parcel_owners WHERE fk_shantytown = :id`,
        {
            replacements: { hid, id: shantytownId },
            transaction,
        },
    );
}

/**
 * Archive les données relationnelles du shantytown (origines, toilettes, électricité, phases, propriétaires)
 */
export default async function archiveRelatedData(
    hid: number,
    shantytownId: number,
    transaction: Transaction,
): Promise<void> {
    await Promise.all([
        archiveOrigins(hid, shantytownId, transaction),
        archiveToiletTypes(hid, shantytownId, transaction),
        archiveElectricityTypes(hid, shantytownId, transaction),
        archivePreparatoryPhases(hid, shantytownId, transaction),
        archiveParcelOwners(hid, shantytownId, transaction),
    ]);
}
