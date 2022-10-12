const getLocalAdminsForDepartement = require('./_common/getLocalAdminsForDepartement');
const getNationalAdmins = require('./_common/getNationalAdmins');

module.exports = async (user) => {
    let localAdmins = null;
    if (user.organization.location.departement !== null) {
        // if the user is related to a specific departement, get the admins for that departement only
        localAdmins = await getLocalAdminsForDepartement(user.organization.location.departement.code);
    }

    // if no local admin was found, provide national admins
    if (localAdmins === null || localAdmins.length === 0) {
        return getNationalAdmins();
    }

    return localAdmins;
};
