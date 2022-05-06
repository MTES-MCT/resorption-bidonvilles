import activity from './activityModel/index';
import changelog from './changelogModel/index';
import charteEngagement from './charteEngagementModel/index';
import closingSolution from './closingSolutionModel/index';
import contactFormReferral from './contactFormReferralModel/index';
import departement from './departementModel/index';
import electricityType from './electricityTypeModel/index';
import etpType from './etpTypeModel/index';
import fieldType from './fieldTypeModel/index';
import financeType from './financeTypeModel/index';
import fundingType from './fundingTypeModel/index';
import geo from './geoModel/index';
import highCovidComment from './highCovidCommentModel/index';
import organizationCategory from './organizationCategoryModel/index';
import organization from './organizationModel/index';
import organizationType from './organizationTypeModel/index';
import ownerType from './ownerTypeModel/index';
import permission from './permissionModel/index';
import planCategory from './planCategoryModel/index';
import plan from './planModel/index';
import planShantytown from './planShantytownModel/index';
import planType from './planTypeModel/index';
import region from './regionModel/index';
import role from './roleModel/index';
import shantytownActor from './shantytownActorModel/index';
import shantytownComment from './shantytownCommentModel/index';
import shantytown from './shantytownModel/index';
import socialOrigin from './socialOriginModel/index';
import statsDirectoryViews from './statsDirectoryViews/index';
import statsExports from './statsExports/index';
import stats from './statsModel/index';
import topic from './topicModel/index';
import userAccess from './userAccessModel/index';
import userActivity from './userActivityModel/index';
import user from './userModel/index';
import userNavigationLogs from './userNavigationLogsModel/index';

export default {
    activity,
    changelog: changelog(),
    charteEngagement: charteEngagement(),
    closingSolution: closingSolution(),
    contactFormReferral: contactFormReferral(),
    departement: departement(),
    electricityType: electricityType(),
    etpType: etpType(),
    fieldType: fieldType(),
    financeType: financeType(),
    fundingType: fundingType(),
    geo: geo(),
    highCovidComment: highCovidComment(),
    organizationCategory: organizationCategory(),
    organization: organization(),
    organizationType: organizationType(),
    ownerType: ownerType(),
    permission: permission(),
    planCategory: planCategory(),
    plan: plan(),
    planShantytown: planShantytown(),
    planType: planType(),
    region: region(),
    role: role(),
    shantytownActor: shantytownActor(),
    shantytownComment: shantytownComment(),
    shantytown: shantytown(),
    socialOrigin: socialOrigin(),
    statsDirectoryViews,
    statsExports,
    stats: stats(),
    topic: topic(),
    userAccess: userAccess(),
    userActivity: userActivity(),
    user: user(),
    userNavigationLogs,
};
