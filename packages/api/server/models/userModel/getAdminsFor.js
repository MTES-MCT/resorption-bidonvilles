const getLocalAdminsForDepartement = require('./_common/getLocalAdminsForDepartement');
const getLocalAdminsForRegion = require('./_common/getLocalAdminsForRegion');
const getNationalAdmins = require('./_common/getNationalAdmins');

module.exports = async (user) => {
    let localAdmins = null;
    if (user.organization.location.departement !== null) {
        // if the user is related to a specific departement, get the admins for that departement only
        localAdmins = await getLocalAdminsForDepartement(user.organization.location.departement.code);
    } else if (user.organization.location.region !== null) {
        // if the user is related to a specific region, get the admins of all departements belonging to that region
        localAdmins = await getLocalAdminsForRegion(user.organization.location.region.code);
    }

    // if no local admin was found, provide national admins
    if (localAdmins === null || localAdmins.length === 0) {
        return getNationalAdmins();
    }

    return localAdmins;
};
