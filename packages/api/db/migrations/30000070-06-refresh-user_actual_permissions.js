const refreshView = require('./common/refreshView');
const createOldView = require('./common/user_actual_permissions/10_reset');
const createNewView = require('./common/user_actual_permissions/11_support_intervention_areas');

module.exports = refreshView('user_actual_permissions', createOldView, createNewView);
