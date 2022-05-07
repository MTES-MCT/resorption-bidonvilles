import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export default async () => {
    const promises = [
        sequelize.query(
            `SELECT
                COUNT(*) AS total,
                departements.code,
                departements.name
            FROM shantytowns
            LEFT JOIN users ON shantytowns.created_by = users.user_id
            LEFT JOIN organizations ON users.fk_organization = organizations.organization_id
            LEFT JOIN cities ON shantytowns.fk_city = cities.code
            LEFT JOIN departements ON cities.fk_departement = departements.code
            WHERE
                organizations.abbreviation <> 'DIHAL'
                OR
                organizations.abbreviation IS NULL
            GROUP BY departements.code, departements.name
            ORDER BY departements.code ASC`,
            {
                type: QueryTypes.SELECT,
            },
        ),
        sequelize.query(
            `SELECT
                COUNT(*) AS total,
                departements.code,
                departements.name
            FROM (
                SELECT
                    shantytown_id,
                    fk_city,
                    COALESCE(updated_by, created_by) AS updated_by
                FROM "ShantytownHistories"
                WHERE updated_by IS NOT NULL OR created_by IS NOT NULL
            ) AS "towns"
            LEFT JOIN users ON towns.updated_by = users.user_id
            LEFT JOIN organizations ON users.fk_organization = organizations.organization_id
            LEFT JOIN cities ON towns.fk_city = cities.code
            LEFT JOIN departements ON cities.fk_departement = departements.code
            WHERE
                organizations.abbreviation <> 'DIHAL'
                OR
                organizations.abbreviation IS NULL
            GROUP BY departements.code, departements.name
            ORDER BY departements.code ASC`,
            {
                type: QueryTypes.SELECT,
            },
        ),
        sequelize.query(
            `SELECT
                COUNT(*) AS total,
                departements.code,
                departements.name
            FROM
                (SELECT
                    shantytowns.fk_city,
                    COALESCE(h1.updated_by, shantytowns.updated_by) AS updated_by
                FROM shantytowns
                LEFT JOIN "ShantytownHistories" h1 ON h1.hid = (
                    SELECT
                        hid
                    FROM
                        "ShantytownHistories" h2
                    WHERE
                        h2.shantytown_id = shantytowns.shantytown_id
                        AND
                        h2.closed_at = shantytowns.closed_at
                    ORDER BY h2."archivedAt" ASC
                    LIMIT 1
                )
                WHERE shantytowns.closed_at IS NOT NULL) towns
            LEFT JOIN users ON towns.updated_by = users.user_id
            LEFT JOIN organizations ON users.fk_organization = organizations.organization_id
            LEFT JOIN cities ON towns.fk_city = cities.code
            LEFT JOIN departements ON cities.fk_departement = departements.code
            WHERE
                organizations.abbreviation <> 'DIHAL'
                OR
                organizations.abbreviation IS NULL
            GROUP BY departements.code, departements.name
            ORDER BY departements.code ASC`,
            {
                type: QueryTypes.SELECT,
            },
        ),
    ];

    const [creations, updates, closings] = await Promise.all(promises);

    return {
        creations,
        updates,
        closings,
    };
};
