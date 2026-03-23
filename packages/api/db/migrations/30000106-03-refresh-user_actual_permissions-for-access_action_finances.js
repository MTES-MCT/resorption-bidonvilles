const refreshView = require('./common/refreshView');
const createOldView = require('./common/user_actual_permissions/11_support_intervention_areas');
const createNewView = require('./common/user_actual_permissions/12_support_access_action_finances');

module.exports = refreshView('user_actual_permissions', createOldView, createNewView);
