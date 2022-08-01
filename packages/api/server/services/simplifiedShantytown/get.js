const simplifiedShantytownModel = require('#server/models/simplifiedShantytownModel');
const ServiceError = require('#server/errors/ServiceError');

module.exports = async (dependencies, ids) => {
    let closedShantytowns;
    try {
        closedShantytowns = await simplifiedShantytownModel.get(dependencies, ids);
        console.log(`closedShantytowns from service: ${JSON.stringify(closedShantytowns)}`);
    } catch (error) {
        throw new ServiceError('fetch_failed', new Error('Une erreur est survenue pendant la récupération des sites en base de données'));
    }
    return closedShantytowns || null;
};
