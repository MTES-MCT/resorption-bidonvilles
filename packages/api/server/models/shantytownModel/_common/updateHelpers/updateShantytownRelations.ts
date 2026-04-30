import { sequelize } from '#db/sequelize';
import { Transaction } from 'sequelize';
import incomingTownsModel from '#server/models/incomingTownsModel';

async function updateIncomingTowns(
    shantytownId: number,
    incomingTowns: any[],
    transaction: Transaction,
): Promise<void> {
    await sequelize.query(
        'DELETE FROM shantytown_incoming_towns WHERE fk_shantytown = :id',
        {
            replacements: { id: shantytownId },
            transaction,
        },
    );

    if (incomingTowns.length > 0) {
        await incomingTownsModel.create(shantytownId, incomingTowns, transaction);
    }
}

async function updateSocialOrigins(
    shantytownId: number,
    origins: any[],
    transaction: Transaction,
): Promise<void> {
    await sequelize.query(
        'DELETE FROM shantytown_origins WHERE fk_shantytown = :id',
        {
            replacements: { id: shantytownId },
            transaction,
        },
    );

    if (origins.length > 0) {
        await sequelize.query(
            `INSERT INTO
                    shantytown_origins(fk_shantytown, fk_social_origin)
                VALUES
                    ${origins.map(() => '(?, ?)').join(', ')}`,
            {
                replacements: origins.reduce((arr, origin) => [...arr, shantytownId, origin], []),
                transaction,
            },
        );
    }
}

async function updateToiletTypes(
    shantytownId: number,
    toiletTypes: any[],
    transaction: Transaction,
): Promise<void> {
    await sequelize.query(
        'DELETE FROM shantytown_toilet_types WHERE fk_shantytown = :id',
        {
            replacements: { id: shantytownId },
            transaction,
        },
    );

    if (toiletTypes.length > 0) {
        await sequelize.query(
            `INSERT INTO
                shantytown_toilet_types(fk_shantytown, toilet_type)
                VALUES
                    ${toiletTypes.map(() => '(?, ?)').join(', ')}`,
            {
                replacements: toiletTypes.reduce((arr, toiletType) => [...arr, shantytownId, toiletType], []),
                transaction,
            },
        );
    }
}

async function updateElectricityTypes(
    shantytownId: number,
    accessTypes: any[],
    transaction: Transaction,
): Promise<void> {
    await sequelize.query(
        'DELETE FROM electricity_access_types WHERE fk_shantytown = :id',
        {
            replacements: { id: shantytownId },
            transaction,
        },
    );

    if (accessTypes.length > 0) {
        await sequelize.query(
            `INSERT INTO
                electricity_access_types(fk_shantytown, electricity_access_type)
                VALUES
                    ${accessTypes.map(() => '(?, ?)').join(', ')}`,
            {
                replacements: accessTypes.reduce((arr, accessType) => [...arr, shantytownId, accessType], []),
                transaction,
            },
        );
    }
}

async function updateClosingSolutions(
    shantytownId: number,
    solutions: any[],
    transaction: Transaction,
): Promise<void> {
    await sequelize.query(
        'DELETE FROM shantytown_closing_solutions WHERE fk_shantytown = :id',
        {
            replacements: { id: shantytownId },
            transaction,
        },
    );

    if (solutions.length > 0) {
        await sequelize.query(
            `INSERT INTO
                    shantytown_closing_solutions(fk_shantytown, fk_closing_solution, number_of_people_affected, number_of_households_affected, message)
                VALUES
                    ${solutions.map(() => '(?, ?, ?, ?, ?)').join(', ')}`,
            {
                replacements: solutions.reduce(
                    (arr, solution) => [
                        ...arr,
                        shantytownId,
                        solution.id,
                        solution.people_affected,
                        solution.households_affected,
                        solution.message,
                    ],
                    [],
                ),
                transaction,
            },
        );
    }
}

/**
 * Met à jour les relations du shantytown (origines, toilettes, électricité, solutions de fermeture, villes entrantes)
 */
export default async function updateShantytownRelations(
    shantytownId: number,
    data: Record<string, any>,
    transaction: Transaction,
): Promise<void> {
    const updates: Promise<void>[] = [];

    if (Array.isArray(data.reinstallation_incoming_towns)) {
        updates.push(updateIncomingTowns(shantytownId, data.reinstallation_incoming_towns, transaction));
    }

    if (Array.isArray(data.social_origins)) {
        updates.push(updateSocialOrigins(shantytownId, data.social_origins, transaction));
    }

    if (Array.isArray(data.sanitary_toilet_types)) {
        updates.push(updateToiletTypes(shantytownId, data.sanitary_toilet_types, transaction));
    }

    if (Array.isArray(data.electricity_access_types)) {
        updates.push(updateElectricityTypes(shantytownId, data.electricity_access_types, transaction));
    }

    if (Array.isArray(data.closing_solutions)) {
        updates.push(updateClosingSolutions(shantytownId, data.closing_solutions, transaction));
    }

    await Promise.all(updates);
}
