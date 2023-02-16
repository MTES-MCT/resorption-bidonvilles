import JSONToCSV from 'json2csv';
import statsModel from '#server/models/statsModel';

const groupByKey = (list, key) => list.reduce((hash, obj) => ({ ...hash, [obj[key]]: { ...hash[obj[key]], ...obj } }), {});

export default async (req, res) => {
    try {
        const [
            averageCompletion,
            people,
            actions,
            resorbedShantytowns,
            shantytowns,
            users,
        ] = await Promise.all([
            statsModel.averageCompletionPercentageByDepartement(),
            statsModel.numberOfPeopleByDepartement(),
            statsModel.numberOfActionsByDepartement(),
            statsModel.numberOfResorbedShantytownByDepartement(),
            statsModel.numberOfShantytownByDepartement(),
            statsModel.numberOfUsersByDepartement(),
        ]);

        const result = Object.values(groupByKey([
            ...averageCompletion.map((r: any) => ({ Département: r.fk_departement, 'Taux de completion': `${(r.avg * 100).toFixed(2)}%` })),
            ...people.map((r: any) => ({ Département: r.fk_departement, 'Nombre habitants': r.total })),
            ...actions.map((r: any) => ({ Département: r.fk_departement, 'Nombre d\'actions': r.total })),
            ...resorbedShantytowns.map((r: any) => ({ Département: r.fk_departement, 'Nombre de résorptions': r.total })),
            ...shantytowns.map((r: any) => ({ Département: r.fk_departement, 'Nombre de sites': r.total })),
            ...users.filter((r: any) => r.fk_departement !== null).map((r: any) => ({ Département: r.fk_departement, "Nombre d'utilisateurs": r.count })),
        ], 'Département')).sort((a: any, b: any) => a.Département - b.Département);

        const csv = JSONToCSV.parse(result);

        // The frontend expect a JSON for every API calls, so we wrap the CSV in a json entry
        res.status(200).send({
            csv,
        });
    } catch (error) {
        res.status(500).send({
            error: {
                user_message: 'Une erreur est survenue lors de la récupération des données en base',
            },
        });
    }
};
