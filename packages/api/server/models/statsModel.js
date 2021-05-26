const { toFormat, getMonthDiffBetween } = require('#server/utils/date');

// Convert rows which contains month/year to a mapping
// 2020-01-01 => x, 2020-01-02 => y
function convertToDateMapping(rows, startDate) {
    const now = new Date();
    const result = [];
    const monthsDiff = getMonthDiffBetween(startDate, now);

    for (let i = 1; i <= monthsDiff; i += 1) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const row = rows.find(({ month, year }) => parseInt(month, 10) === date.getMonth() + 1 && year === date.getFullYear());
        result.unshift({
            month: toFormat(date, 'M Y'),
            total: row !== undefined ? row.total : 0,
        });
    }

    return result;
}

module.exports = database => ({
    numberOfPeople: async (departement) => {
        const rows = await database.query(
            `
            SELECT SUM(population_total) AS total
            FROM shantytowns 
            LEFT JOIN cities AS city ON shantytowns.fk_city = city.code
            WHERE closed_at IS NULL
            ${departement ? `AND fk_departement = '${departement}'` : ''}
            `,
            {
                type: database.QueryTypes.SELECT,
            },
        );

        return rows[0].total;
    },

    numberOfShantytown: async (departement) => {
        const rows = await database.query(
            `
            SELECT COUNT(*) AS total 
            FROM shantytowns 
            LEFT JOIN cities AS city ON shantytowns.fk_city = city.code
            WHERE closed_at IS NULL
            ${departement ? `AND fk_departement = '${departement}'` : ''}
            `,
            {
                type: database.QueryTypes.SELECT,
            },
        );

        return rows[0].total;
    },

    numberOfResorbedShantytown: async (departement) => {
        const rows = await database.query(
            `
            SELECT COUNT(*) AS total
            FROM shantytowns 
            LEFT JOIN cities AS city ON shantytowns.fk_city = city.code
            WHERE closed_at IS NOT NULL
            AND closed_with_solutions='yes'
            AND shantytowns.created_at > '2019-01-01'
            ${departement ? `AND fk_departement = '${departement}'` : ''}
            `,
            {
                type: database.QueryTypes.SELECT,
            },
        );

        return rows[0].total;
    },

    numberOfPlans: async (departement) => {
        const rows = await database.query(
            `
            SELECT COUNT(*) AS total 
            FROM plans2
            LEFT JOIN plan_departements on plan_departements.fk_plan = plans2.plan_id
            WHERE closed_at IS NULL
            ${departement ? `AND fk_departement = '${departement}'` : ''}
            `,
            {
                type: database.QueryTypes.SELECT,
            },
        );

        return rows[0].total;
    },

    numberOfUsers: async (departement) => {
        const rows = await database.query(
            `
            SELECT COUNT(*) from users
            LEFT JOIN organizations on users.fk_organization = organizations.organization_id
            WHERE fk_status = 'active'
            ${departement ? `AND fk_departement = '${departement}'` : ''}
            `,
            {
                type: database.QueryTypes.SELECT,
            },
        );

        return rows[0].count;
    },


    numberOfDepartements: async () => {
        const rows = await database.query(
            `SELECT
                    COUNT(*) AS total
                FROM (
                    SELECT
                        organizations.departement_code
                    FROM users
                    LEFT JOIN localized_organizations AS organizations ON users.fk_organization = organizations.organization_id
                    WHERE
                        users.fk_status='active'
                        AND
                        organizations.active = TRUE
                    GROUP BY organizations.departement_code
                ) t`,
            {
                type: database.QueryTypes.SELECT,
            },
        );

        return rows[0].total;
    },

    numberOfActiveUsers: async () => {
        const rows = await database.query(
            `SELECT
                COUNT(*) AS total
            FROM users
            LEFT JOIN localized_organizations AS organizations ON users.fk_organization = organizations.organization_id
            WHERE
                users.fk_status='active'
                AND
                organizations.active = TRUE
            `,
            {
                type: database.QueryTypes.SELECT,
            },
        );

        return rows[0].total;
    },

    numberOfUsersAtMonth: async (date = '2020-06-01') => {
        const rows = await database.query(
            `SELECT
                COUNT(*) AS total
                FROM user_accesses ua
            WHERE 
                ua.used_at IS NOT NULL
                AND
                ua.used_at < '${date}'`,
            {
                type: database.QueryTypes.SELECT,
            },
        );

        return rows[0].total;
    },

    numberOfOpenShantytownsAtMonth: async (departement, date = '2020-06-01') => {
        const rows = await database.query(
            `SELECT
                COUNT(*) AS total
            FROM shantytowns LEFT JOIN cities AS city ON shantytowns.fk_city = city.code
            WHERE 
                (shantytowns.created_at <= '${date}')
                AND 
                (shantytowns.closed_at >= '${date}' OR shantytowns.closed_at IS NULL)
                ${departement ? `AND fk_departement = '${departement}'` : ''}
                `,
            {
                type: database.QueryTypes.SELECT,
            },
        );

        return rows[0].total;
    },


    numberOfClosedShantytownsPerMonth: async (departement = null, startDateStr = '2019-06-01') => {
        const rows = await database.query(
            `SELECT 
                EXTRACT(YEAR FROM shantytowns.closed_at) AS year,
                EXTRACT(MONTH FROM shantytowns.closed_at) AS month,
                COUNT(*) AS total
            FROM shantytowns LEFT JOIN cities AS city ON shantytowns.fk_city = city.code
            WHERE
                closed_at > '${startDateStr}'
                AND closed_with_solutions != 'yes'
                ${departement ? `AND fk_departement = '${departement}'` : ''}
            GROUP BY year, month
            ORDER BY year ASC ,month ASC`,
            {
                type: database.QueryTypes.SELECT,
            },
        );

        return convertToDateMapping(rows, new Date(startDateStr));
    },

    numberOfNewShantytownsPerMonth: async (departement = null, startDateStr = '2019-06-01') => {
        const rows = await database.query(
            `SELECT 
                EXTRACT(YEAR FROM shantytowns.created_at) AS year,
                EXTRACT(MONTH FROM shantytowns.created_at) AS month,
                COUNT(*) AS total
            FROM shantytowns LEFT JOIN cities AS city ON shantytowns.fk_city = city.code
            WHERE
                (shantytowns.created_at > '${startDateStr}' OR shantytowns.declared_at > '${startDateStr}')
                ${departement ? `AND fk_departement = '${departement}'` : ''}
            GROUP BY year, month
            ORDER BY year ASC, month ASC`,
            {
                type: database.QueryTypes.SELECT,
            },
        );

        return convertToDateMapping(rows, new Date(startDateStr));
    },

    numberOfResorbedShantytownsPerMonth: async (departement = null, startDateStr = '2019-06-01') => {
        const rows = await database.query(
            `SELECT 
                EXTRACT(YEAR FROM shantytowns.closed_at) AS year,
                EXTRACT(MONTH FROM shantytowns.closed_at) AS month,
                COUNT(*) AS total
            FROM shantytowns LEFT JOIN cities AS city ON shantytowns.fk_city = city.code
            WHERE
                closed_at > '${startDateStr}'
                AND
                closed_with_solutions = 'yes'
                ${departement ? `AND fk_departement = '${departement}'` : ''}
            GROUP BY year, month
            ORDER BY year ASC ,month ASC`,
            {
                type: database.QueryTypes.SELECT,
            },
        );

        return convertToDateMapping(rows, new Date(startDateStr));
    },

    numberOfNewUsersPerMonth: async (startDateStr = '2020-06-01') => {
        const startDate = new Date(startDateStr);
        const now = new Date();
        const limit = new Date(now.getFullYear(), now.getMonth() - 7, 1);

        const rows = await database.query(
            `SELECT
                EXTRACT(YEAR FROM ua.used_at) AS year,
                EXTRACT(MONTH FROM ua.used_at) AS month,
                COUNT(*) AS total
            FROM user_accesses ua
            WHERE
                ua.used_at IS NOT NULL
                AND
                EXTRACT(EPOCH FROM ua.used_at) >= 10000
            GROUP BY year, month
            ORDER BY year ASC,month ASC`,
            {
                type: database.QueryTypes.SELECT,
                replacements: {
                    limit: limit.getTime() / 1000,
                },
            },
        );

        return convertToDateMapping(rows, startDate);
    },

    numberOfCollaboratorAndAssociationUsers: async () => {
        const rows = await database.query(
            `SELECT
                organization_types.fk_category,
                COUNT(*) AS total
            FROM users
            LEFT JOIN localized_organizations AS organizations ON users.fk_organization = organizations.organization_id
            LEFT JOIN organization_types ON organizations.fk_type = organization_types.organization_type_id
            WHERE
                users.fk_status='active'
                AND
                organizations.active = TRUE
                AND
                organization_types.fk_category IN ('territorial_collectivity', 'association', 'public_establishment', 'administration')
            GROUP BY organization_types.fk_category    
            `,
            {
                type: database.QueryTypes.SELECT,
            },
        );

        return rows.reduce((hash, row) => Object.assign({}, hash, {
            [row.fk_category]: row.total,
        }), {});
    },

    numberOfCollaboratorAndAssociationOrganizations: async () => {
        const rows = await database.query(
            `SELECT
                organization_types.fk_category,
                COUNT(DISTINCT users.fk_organization) AS total
            FROM users
            LEFT JOIN localized_organizations AS organizations ON users.fk_organization = organizations.organization_id
            LEFT JOIN organization_types ON organizations.fk_type = organization_types.organization_type_id
            WHERE
                users.fk_status='active'
                AND
                organizations.active = TRUE
                AND
                organization_types.fk_category IN ('territorial_collectivity', 'association', 'public_establishment', 'administration')
            GROUP BY organization_types.fk_category`,
            {
                type: database.QueryTypes.SELECT,
            },
        );

        return rows.reduce((hash, row) => Object.assign({}, hash, {
            [row.fk_category]: row.total,
        }), {});
    },

    numberOfShantytownOperations: async () => {
        const promises = [
            database.query(
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
                    type: database.QueryTypes.SELECT,
                },
            ),
            database.query(
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
                    type: database.QueryTypes.SELECT,
                },
            ),
            database.query(
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
                    type: database.QueryTypes.SELECT,
                },
            ),
        ];

        const [creations, updates, closings] = await Promise.all(promises);

        return {
            creations,
            updates,
            closings,
        };
    },

    numberOfComments: async () => {
        const rows = await database.query(
            'SELECT COUNT(*) AS total FROM shantytown_comments',
            {
                type: database.QueryTypes.SELECT,
            },
        );

        return rows[0].total;
    },

    meanTimeBeforeCreationDeclaration: async () => {
        const rows = await database.query(
            `SELECT
                AVG(diff) AS average,
                percentile_disc(0.5) within group (ORDER BY diff) AS median
            FROM
                (SELECT
                    COALESCE(built_at, declared_at) AS d,
                    EXTRACT(day from created_at - COALESCE(built_at, declared_at)) AS diff
                FROM shantytowns
                WHERE built_at IS NOT NULL OR declared_at IS NOT NULL) t
            WHERE
                d >= '2019-09-01'::date /* date of official opening to actual users */
            `,
            {
                type: database.QueryTypes.SELECT,
            },
        );

        return rows[0];
    },

    meanTimeBeforeClosingDeclaration: async () => {
        const rows = await database.query(
            `SELECT
                AVG(diff) AS average,
                percentile_disc(0.5) within group (ORDER BY diff) AS median
            FROM (SELECT
                    shantytowns.closed_at AS d,
                    EXTRACT(days from COALESCE(h1."archivedAt", shantytowns.updated_at) - shantytowns.closed_at) AS diff
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
                WHERE shantytowns.closed_at IS NOT NULL
            ) t
            WHERE
                d >= '2019-09-01'::date /* date of official opening to actual users */
            `,
            {
                type: database.QueryTypes.SELECT,
            },
        );

        return rows[0];
    },

    numberOfCreditsPerYear: async (departement) => {
        const rows = await database.query(
            `
                SELECT 
                    SUM(amount) as total, 
                    year,
                    finance_rows.fk_finance_type as type
                FROM finance_rows
                LEFT JOIN finances on finance_rows.fk_finance = finances.finance_id
                LEFT JOIN plans2 on finances.fk_plan = plans2.plan_id
                LEFT JOIN plan_departements on plan_departements.fk_plan = plans2.plan_id
                ${departement ? `WHERE fk_departement = '${departement}'` : ''}
                GROUP BY year, type
            `,
            {
                type: database.QueryTypes.SELECT,
            },
        );

        // transforms rows in a mapping { 2020: {[type]: total}}
        return rows.reduce((acc, obj) => ({
            ...acc,
            [obj.year]: {
                ...(acc[obj.year] || {}),
                [obj.type]: obj.total,
            },
        }), {});
    },

    averageCompletionPercentage: async (departement) => {
        const rows = await database.query(
            `SELECT
                AVG(pourcentage_completion)
            FROM
            (SELECT
                c.fk_departement,
                ((CASE WHEN (SELECT regexp_matches(s.address, '^(.+) [0-9]+ [^,]+,? [0-9]+,? [^, ]+(,.+)?$'))[1] IS NOT NULL THEN 1 ELSE 0 END)
                +
                (CASE WHEN ft.label <> 'Inconnu' THEN 1 ELSE 0 END)
                +
                (CASE WHEN ot.label <> 'Inconnu' THEN 1 ELSE 0 END)
                +
                (CASE WHEN s.census_status IS NOT NULL THEN 1 ELSE 0 END)
                +
                (CASE WHEN s.population_total IS NOT NULL THEN 1 ELSE 0 END)
                +
                (CASE WHEN s.population_couples IS NOT NULL THEN 1 ELSE 0 END)
                +
                (CASE WHEN s.population_minors IS NOT NULL THEN 1 ELSE 0 END)
                +
                (CASE WHEN s.population_total IS NOT NULL AND s.population_total >= 10 AND (SELECT COUNT(*) FROM shantytown_origins WHERE fk_shantytown = s.shantytown_id) > 0 THEN 1 ELSE 0 END)
                +
                (CASE WHEN et.label <> 'Inconnu' THEN 1 ELSE 0 END)
                +
                (CASE WHEN s.access_to_water IS NOT NULL THEN 1 ELSE 0 END)
                +
                (CASE WHEN s.access_to_sanitary IS NOT NULL THEN 1 ELSE 0 END)
                +
                (CASE WHEN s.trash_evacuation IS NOT NULL THEN 1 ELSE 0 END))::FLOAT / 12.0 AS pourcentage_completion
            FROM
                shantytowns s
            LEFT JOIN
                cities c ON s.fk_city = c.code
            LEFT JOIN
                field_types ft ON s.fk_field_type = ft.field_type_id
            LEFT JOIN
                owner_types ot ON s.fk_owner_type = ot.owner_type_id
            LEFT JOIN
                electricity_types et ON s.fk_electricity_type = et.electricity_type_id
            WHERE
                s.closed_at IS NULL
                ${departement ? `AND c.fk_departement = '${departement}'` : ''}
            ) AS tmp
            `,
            {
                type: database.QueryTypes.SELECT,
            },
        );

        return rows[0].avg;
    },

    numberOfReviewedComments() {
        return Promise.resolve(-1);
    },

    async populationTotal(departement) {
        /**
         * Retourne un objet Date formatté pour toujours correspondre au premier du mois et à 0h 0mn 0s 0ms
         *
         * De tels objets permettent de comparer des mois entre eux (le jour et les heures étant égales
         * par ailleurs).
         *
         * @param {Mixed} date N'importe quel paramètre valide pour le constructeur Date
         *
         * @returns {Date}
         */
        function getMonthlyDate(date) {
            const d = new Date(date);
            d.setDate(1);
            d.setHours(0, 0, 0, 0);

            return d;
        }

        // on définit les bornes autour desquelles on veut l'évolution de la population, à savoir :
        // du 1er Mai 2019 au mois précédent (inclus)
        const min = new Date(2019, 4, 1, 0, 0, 0, 0); // 1er Mai 2019
        const max = getMonthlyDate(new Date());
        max.setMonth(max.getMonth() + 1);

        // on initialise l'objet final qui sera retourné (resultArr) avec un total de 0 pour chaque mois
        // on construit également une table de hashage (result) pour un accès direct à chaque mois plus
        // loin dans l'algorithme (voir la fonction addPopulation())
        const result = {};
        const resultArr = [];
        for (let d = new Date(min); d < max; d.setMonth(d.getMonth() + 1)) {
            const obj = {
                month: toFormat(d, 'M Y'),
                total: 0,
            };
            result[`${d.getFullYear()}-${d.getMonth()}`] = obj;
            resultArr.push(obj);
        }

        /**
         * @param {Number} population Total à rajouter
         * @param {String} fromStr Date à partir de laquelle il faut augmenter la population (inclus)
         * @param {String} toStr Date jusqu'à laquelle il faut augmenter la population (exclus : si la date
         *                       est en Février, le mois de Février est ignoré)
         */
        function addPopulation(population, fromStr, toStr) {
            const from = getMonthlyDate(fromStr);
            const to = toStr ? getMonthlyDate(toStr) : max;

            const d = new Date(from < min ? min : from);
            while (d < to && d < max) {
                result[`${d.getFullYear()}-${d.getMonth()}`].total += population;
                d.setMonth(d.getMonth() + 1);
            }
        }

        // on requête la base de données
        const rows = await database.query(
            `SELECT
            t2.shantytown_id,
            t2.population_total,
            t2.closed_at,
            CASE WHEN t2.asc_rank = '1' THEN t2.opened_at ELSE t2.input_date END AS "ref_date"
        FROM
        (
            SELECT
                t.shantytown_id,
                t.population_total,
                t.input_date,
                COALESCE(s.built_at, s.declared_at) AS "opened_at",
                s.closed_at AS "closed_at",
                RANK() OVER(
                    PARTITION BY t.shantytown_id ORDER BY t.input_date ASC
                ) AS "asc_rank",
                RANK() OVER(
                    PARTITION BY t.shantytown_id, EXTRACT(YEAR FROM t.input_date), EXTRACT(MONTH FROM t.input_date) ORDER BY t.input_date DESC
                ) AS "month_rank"
            FROM (
                (
                    SELECT
                        s.shantytown_id,
                        population_total,
                        COALESCE(s.updated_at, s.created_at) AS "input_date"
                    FROM
                        shantytowns s
                )
                UNION
                (
                    SELECT
                        s.shantytown_id,
                        population_total,
                        COALESCE(s.updated_at, s.created_at) AS "input_date"
                    FROM
                        "ShantytownHistories" s
                )
            ) t
            LEFT JOIN shantytowns s ON t.shantytown_id = s.shantytown_id
            LEFT JOIN cities c ON s.fk_city = c.code
            ${departement ? 'WHERE c.fk_departement = :departement' : ''}
        ) t2
        WHERE t2.opened_at IS NOT NULL AND t2.month_rank = '1'
        ORDER BY t2.shantytown_id ASC, t2.input_date ASC`,
            {
                type: database.QueryTypes.SELECT,
                replacements: {
                    departement,
                },
            },
        );

        // on traite chaque ligne une par une
        for (let i = 0; i < rows.length; i += 1) {
            const {
                shantytown_id, population_total, closed_at, ref_date,
            } = rows[i];
            const next = rows[i + 1];

            // si la population totale est inconnue (ou à 0), on ignore cette saisie
            if (!population_total) {
                // eslint-disable-next-line no-continue
                continue;
            }

            // nous sommes sur la dernière saisie pour ce site alors on remplit jusqu'au mois de fermeture
            if (!next || next.shantytown_id !== shantytown_id) {
                addPopulation(population_total, ref_date, closed_at);
                // eslint-disable-next-line no-continue
                continue;
            }

            // nous ne sommes pas sur la dernière saisie pour ce site alors on remplit du mois de cette
            // saisie jusqu'au mois de la saisie suivante
            addPopulation(population_total, ref_date, next.ref_date);
        }

        return resultArr;
    },
});
