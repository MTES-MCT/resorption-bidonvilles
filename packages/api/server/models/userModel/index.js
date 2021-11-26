const create = require('./create');
const deactivate = require('./deactivate');
const deleteUser = require('./delete');
const downgradeLocalAdmin = require('./downgradeLocalAdmin');
const findAll = require('./findAll');
const findByIds = require('./findByIds');
const findByOrganization = require('./findByOrganization');
const findByOrganizationCategory = require('./findByOrganizationCategory');
const findDepartementSummarySubscribers = require('./findDepartementSummarySubscribers');
const findForRegion = require('./findForRegion');
const findOne = require('./findOne');
const findOneByAccessId = require('./findOneByAccessId');
const findOneByEmail = require('./findOneByEmail');
const formatName = require('./_common/formatName');
const getAdminsFor = require('./getAdminsFor');
const getDirectory = require('./getDirectory');
const getHistory = require('./getHistory');
const getLocationWatchers = require('./getLocationWatchers');
const getNationalAdmins = require('./_common/getNationalAdmins');
const getShantytownWatchers = require('./getShantytownWatchers');
const listExport = require('./listExport');
const setPermissionOptions = require('./setPermissionOptions');
const update = require('./update');
const upgradeLocalAdmin = require('./upgradeLocalAdmin');
const setUserRoleRegular = require('./setUserRoleRegular');

module.exports = () => ({
    create,
    deactivate,
    delete: deleteUser,
    downgradeLocalAdmin,
    findAll,
    findByIds,
    findByOrganization,
    findByOrganizationCategory,
    findDepartementSummarySubscribers,
    findForRegion,
    findOne,
    findOneByAccessId,
    findOneByEmail,
    formatName,
    getAdminsFor,
    getDirectory,
    getHistory,
    getLocationWatchers,
    getNationalAdmins,
    getShantytownWatchers,
    listExport,
    setPermissionOptions,
    update,
    upgradeLocalAdmin,
    setUserRoleRegular,
});
