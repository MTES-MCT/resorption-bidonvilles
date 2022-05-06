import create from './create';
import deactivate from './deactivate';
import deleteUser from './delete';
import downgradeLocalAdmin from './downgradeLocalAdmin';
import findAll from './findAll';
import findByIds from './findByIds';
import findByOrganization from './findByOrganization';
import findByOrganizationCategory from './findByOrganizationCategory';
import findDepartementSummarySubscribers from './findDepartementSummarySubscribers';
import findForRegion from './findForRegion';
import findOne from './findOne';
import findOneByAccessId from './findOneByAccessId';
import findOneByEmail from './findOneByEmail';
import formatName from './_common/formatName';
import getAdminsFor from './getAdminsFor';
import getDirectory from './getDirectory';
import getHistory from './getHistory';
import getLocationWatchers from './getLocationWatchers';
import getNationalAdmins from './_common/getNationalAdmins';
import getShantytownWatchers from './getShantytownWatchers';
import listExport from './listExport';
import setPermissionOptions from './setPermissionOptions';
import update from './update';
import upgradeLocalAdmin from './upgradeLocalAdmin';

export default () => ({
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
});
