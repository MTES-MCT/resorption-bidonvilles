import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import dateUtils from '#server/utils/date';

const { toFormat } = dateUtils;

export default async (departement) => {
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

    // on définit les bornes autour de squelles on veut l'évolution de la population, à savoir :
    // pour les habitants : du 1er Mai 2019 au mois précédent (inclus)
    // pour les habitants UE : du 1er Mars 2021 au mois précédent (inclus)
    const min = new Date(2019, 4, 1, 0, 0, 0, 0); // 1er Mai 2019
    const ueMin = new Date(2021, 2, 1, 0, 0, 0, 0); // 1er Mars 2021
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
            totalLivingInTownsBiggerThan10: 0,
            totalEU: 0,
            totalEULivingInTownsBiggerThan10: 0,
        };
        result[`${d.getFullYear()}-${d.getMonth()}`] = obj;
        resultArr.push(obj);
    }

    /**
     * @param {Number}     population Total à rajouter
     * @param {Array|null} origins Liste des nationalités des habitants (ou NULL si inconnu)
     * @param {String}     fromStr Date à partir de laquelle il faut augmenter la population (inclus)
     * @param {String}     toStr Date jusqu'à laquelle il faut augmenter la population (exclus :
     *                           si la date est en Février, le mois de Février est ignoré)
     */
    function addPopulation(population, origins, fromStr, toStr) {
        const from = getMonthlyDate(fromStr);
        const to = toStr ? getMonthlyDate(toStr) : max;

        const d = new Date(from < min ? min : from);
        const europeanOnly = origins && origins.length === 1 && origins[0] === 'european';
        while (d < to && d < max) {
            const row = result[`${d.getFullYear()}-${d.getMonth()}`];

            row.total += population;
            if (europeanOnly && d >= ueMin) {
                row.totalEU += population;
            }

            if (population >= 10) {
                row.totalLivingInTownsBiggerThan10 += population;
                if (europeanOnly && d >= ueMin) {
                    row.totalEULivingInTownsBiggerThan10 += population;
                }
            }

            d.setMonth(d.getMonth() + 1);
        }
    }

    // on requête la base de données
    const rows = await sequelize.query(
        `SELECT
        t2.shantytown_id,
        t2.population_total,
        t2.origins,
        t2.closed_at,
        CASE WHEN t2.asc_rank = '1' THEN t2.opened_at ELSE t2.input_date END AS "ref_date"
    FROM
    (
        SELECT
            t.shantytown_id,
            t.population_total,
            t.origins,
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
                    array_agg(sco.uid) AS origins,
                    COALESCE(s.updated_at, s.created_at) AS "input_date"
                FROM shantytowns s
                LEFT JOIN shantytown_origins so ON so.fk_shantytown = s.shantytown_id
                LEFT JOIN social_origins sco ON so.fk_social_origin = sco.social_origin_id
                GROUP BY s.shantytown_id
            )
            UNION
            (
                SELECT
                    s.shantytown_id,
                    population_total,
                    array_agg(sco.uid) AS origins,
                    COALESCE(s.updated_at, s.created_at) AS "input_date"
                FROM "ShantytownHistories" s
                LEFT JOIN "ShantytownOriginHistories" so ON so.fk_shantytown = s.hid
                LEFT JOIN social_origins sco ON so.fk_social_origin = sco.social_origin_id
                GROUP BY s.hid
            )
        ) t
        LEFT JOIN shantytowns s ON t.shantytown_id = s.shantytown_id
        LEFT JOIN cities c ON s.fk_city = c.code
        ${departement ? 'WHERE c.fk_departement = :departement' : ''}
    ) t2
    WHERE t2.opened_at IS NOT NULL AND t2.month_rank = '1'
    ORDER BY t2.shantytown_id ASC, t2.input_date ASC`,
        {
            type: QueryTypes.SELECT,
            replacements: {
                departement,
            },
        },
    );

    // on traite chaque ligne une par une
    for (let i = 0; i < rows.length; i += 1) {
        const {
            shantytown_id, population_total, origins, closed_at, ref_date,
        } = rows[i];
        const next = rows[i + 1];

        // si la population totale est inconnue (ou à 0), on ignore cette saisie
        if (!population_total) {
            // eslint-disable-next-line no-continue
            continue;
        }

        // nous sommes sur la dernière saisie pour ce site alors on remplit jusqu'au mois de fermeture
        if (!next || next.shantytown_id !== shantytown_id) {
            addPopulation(population_total, origins, ref_date, closed_at);
            // eslint-disable-next-line no-continue
            continue;
        }

        // nous ne sommes pas sur la dernière saisie pour ce site alors on remplit du mois de cette
        // saisie jusqu'au mois de la saisie suivante
        addPopulation(population_total, origins, ref_date, next.ref_date);
    }

    return resultArr;
};
