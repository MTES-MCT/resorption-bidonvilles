const path = require('path');
const express = require('express');

// controllers
const middlewares = require('#server/middlewares');
import controllers from '#server/controllers';
const validators = require('#server/middlewares/validators');

export default (app) => {
    app.use('/assets', express.static(path.resolve(__dirname, '../../assets')));

    app.get(
        '/',
        (req, res) => res.status(200).send('Bienvenue sur l\'API de Résorption Bidonvilles'),
    );
    app.post(
        '/signin',
        controllers.user.signin,
    );
    app.get(
        '/refreshToken',
        middlewares.auth.authenticate,
        middlewares.appVersion.sync,
        controllers.user.renewToken,
    );
    app.get(
        '/config',
        middlewares.auth.authenticate,
        middlewares.appVersion.sync,
        controllers.config.list,
    );
    app.post(
        '/changelog',
        middlewares.auth.authenticate,
        middlewares.appVersion.sync,
        controllers.user.setLastChangelog,
    );

    // directory
    app.get(
        '/directory',
        middlewares.auth.authenticate,
        middlewares.charte.check,
        middlewares.appVersion.sync,
        controllers.directory.list,
    );

    // user
    app.get(
        '/users',
        middlewares.auth.authenticate,
        (...args) => middlewares.auth.checkPermissions(['user.list'], ...args),
        middlewares.charte.check,
        middlewares.appVersion.sync,
        controllers.user.list,
    );
    app.get(
        '/users/export',
        middlewares.auth.authenticate,
        middlewares.auth.isSuperAdmin,
        controllers.user.listExport,
    );
    app.get(
        '/me',
        middlewares.auth.authenticate,
        middlewares.appVersion.sync,
        controllers.user.me,
    );
    app.post(
        '/me',
        middlewares.auth.authenticate,
        middlewares.charte.check,
        middlewares.appVersion.sync,
        validators.editUser,
        middlewares.validation,
        controllers.user.edit,
    );
    app.post(
        '/me/navigationLogs',
        middlewares.auth.authenticate,
        middlewares.charte.check,
        middlewares.appVersion.sync,
        validators.me.postNavigationLogs,
        middlewares.validation,
        controllers.userNavigationLogs.insert,
    );
    app.get(
        '/users/:id',
        middlewares.auth.authenticate,
        (...args) => middlewares.auth.checkPermissions(['user.read'], ...args),
        middlewares.charte.check,
        middlewares.appVersion.sync,
        controllers.user.get,
    );
    app.put(
        '/users/:id',
        middlewares.auth.authenticate,
        middlewares.auth.isSuperAdmin,
        middlewares.charte.check,
        middlewares.appVersion.sync,
        validators.editUser,
        middlewares.validation,
        controllers.user.edit,
    );

    app.put(
        '/users/:id/charte_engagement',
        middlewares.auth.authenticate,
        controllers.user.acceptCharte,
    );
    app.post(
        '/users',
        middlewares.auth.authenticate,
        (...args) => middlewares.auth.checkPermissions(['user.create'], ...args),
        middlewares.charte.check,
        middlewares.appVersion.sync,
        validators.createUser,
        middlewares.validation,
        controllers.user.create,
    );
    app.post(
        '/contact',
        validators.createContact,
        middlewares.validation,
        controllers.contact.contact,
    );
    app.post(
        '/invite',
        validators.invite,
        middlewares.validation,
        controllers.invite.invite,
    );
    app.post(
        '/users/:id/sendActivationLink',
        middlewares.auth.authenticate,
        (...args) => middlewares.auth.checkPermissions(['user.activate'], ...args),
        middlewares.charte.check,
        middlewares.appVersion.sync,
        controllers.user.sendActivationLink,
    );
    app.post(
        '/users/:id/denyAccess',
        middlewares.auth.authenticate,
        (...args) => middlewares.auth.checkPermissions(['user.activate'], ...args),
        middlewares.charte.check,
        middlewares.appVersion.sync,
        controllers.user.denyAccess,
    );
    app.post(
        '/users/:id/activate',
        controllers.user.activate,
    );
    app.post(
        '/users/:id/upgrade',
        middlewares.auth.authenticate,
        middlewares.appVersion.sync,
        controllers.user.upgrade,
    );
    app.put(
        '/users/:id/admin_comments',
        middlewares.auth.authenticate,
        middlewares.auth.isSuperAdmin,
        middlewares.charte.check,
        middlewares.appVersion.sync,
        validators.setUserAdminComments,
        middlewares.validation,
        controllers.user.setAdminComments,
    );
    app.get(
        '/activation-tokens/:token/check',
        controllers.user.checkActivationToken,
    );
    app.delete(
        '/users/:id',
        middlewares.auth.authenticate,
        (...args) => middlewares.auth.checkPermissions(['user.deactivate'], ...args),
        middlewares.charte.check,
        middlewares.appVersion.sync,
        controllers.user.remove,
    );
    app.post(
        '/users/:id/local-admin',
        middlewares.auth.authenticate,
        middlewares.auth.isSuperAdmin,
        controllers.user.updateLocalAdmin,
    );
    app.patch(
        '/users/:id/role_regular',
        middlewares.auth.authenticate,
        middlewares.auth.isSuperAdmin,
        middlewares.charte.check,
        middlewares.appVersion.sync,
        validators.user.setRoleRegular,
        middlewares.validation,
        controllers.user.setRoleRegular,
    );
    app.post(
        '/users/new-password',
        controllers.user.requestNewPassword,
    );
    app.get(
        '/password-tokens/:token/check',
        controllers.user.checkPasswordToken,
    );
    app.post(
        '/users/:id/newPassword',
        controllers.user.setNewPassword,
    );

    // shantytown actors
    app.post(
        '/towns/:id/actors',
        middlewares.auth.authenticate,
        middlewares.shantytown.checkReadPermission,
        middlewares.charte.check,
        middlewares.appVersion.sync,
        validators.shantytownActors.addShantytownActor,
        middlewares.validation,
        controllers.town.addActor,
    );
    app.put(
        '/towns/:id/actors/:user_id',
        middlewares.auth.authenticate,
        middlewares.shantytown.checkReadPermission,
        middlewares.charte.check,
        middlewares.appVersion.sync,
        validators.shantytownActors.updateShantytownActor,
        middlewares.validation,
        controllers.town.updateActor,
    );
    app.delete(
        '/towns/:id/actors/:user_id/themes/:theme_id',
        middlewares.auth.authenticate,
        middlewares.shantytown.checkReadPermission,
        middlewares.charte.check,
        middlewares.appVersion.sync,
        validators.shantytownActors.removeShantytownActorTheme,
        middlewares.validation,
        controllers.town.removeActorTheme,
    );
    app.put(
        '/towns/:id/invitations',
        middlewares.auth.authenticate,
        middlewares.shantytown.checkReadPermission,
        middlewares.charte.check,
        middlewares.appVersion.sync,
        validators.shantytownActors.inviteShantytownActor,
        middlewares.validation,
        controllers.town.inviteNewActor,
    );
    app.delete(
        '/towns/:id/actors/:user_id',
        middlewares.auth.authenticate,
        middlewares.shantytown.checkReadPermission,
        middlewares.charte.check,
        middlewares.appVersion.sync,
        validators.shantytownActors.removeShantytownActor,
        middlewares.validation,
        controllers.town.removeActor,
    );
    app.get(
        '/towns/:id/relations',
        middlewares.auth.authenticate,
        middlewares.shantytown.checkReadPermission,
        middlewares.charte.check,
        middlewares.appVersion.sync,
        controllers.town.getRelations,
    );
    app.get(
        '/actors',
        middlewares.auth.authenticate,
        (...args) => middlewares.auth.checkPermissions(['shantytown_actor.export'], ...args),
        middlewares.charte.check,
        middlewares.appVersion.sync,
        controllers.town.exportActors,
    );

    app.get(
        '/towns/findNearby',
        validators.findNearbyTowns,
        middlewares.auth.authenticate,
        (...args) => middlewares.auth.checkPermissions(['shantytown.list'], ...args),
        middlewares.charte.check,
        middlewares.appVersion.sync,
        controllers.town.findNearbyTowns,
    );

    // plans
    app.get(
        '/plans',
        middlewares.auth.authenticate,
        (...args) => middlewares.auth.checkPermissions(['plan.list'], ...args),
        middlewares.charte.check,
        middlewares.appVersion.sync,
        controllers.plan.list,
    );
    app.get(
        '/plans/export',
        middlewares.auth.authenticate,
        (...args) => middlewares.auth.checkPermissions(['plan.export'], ...args),
        middlewares.charte.check,
        middlewares.appVersion.sync,
        controllers.plan.listExport,
    );
    app.get(
        '/plans/:id',
        middlewares.auth.authenticate,
        (...args) => middlewares.auth.checkPermissions(['plan.read'], ...args),
        middlewares.charte.check,
        middlewares.appVersion.sync,
        controllers.plan.find,
    );
    app.post(
        '/plans',
        middlewares.auth.authenticate,
        (...args) => middlewares.auth.checkPermissions(['plan.create'], ...args),
        middlewares.charte.check,
        middlewares.appVersion.sync,
        controllers.plan.create,
    );
    app.post(
        '/plans/:id',
        middlewares.auth.authenticate,
        (...args) => middlewares.auth.checkPermissions(['plan.update'], ...args),
        middlewares.charte.check,
        middlewares.appVersion.sync,
        controllers.plan.update,
    );
    app.post(
        '/plans/:id/states',
        middlewares.auth.authenticate,
        (...args) => middlewares.auth.checkPermissions(['plan.updateMarks'], ...args),
        middlewares.charte.check,
        middlewares.appVersion.sync,
        controllers.plan.addState,
    );
    app.post(
        '/plans/:id/comments',
        middlewares.auth.authenticate,
        (...args) => middlewares.auth.checkPermissions(['plan_comment.create'], ...args),
        middlewares.charte.check,
        middlewares.appVersion.sync,
        validators.planComment.createPlanComment,
        middlewares.validation,
        controllers.planComment.create,
    );
    app.patch(
        '/plans/:id',
        middlewares.auth.authenticate,
        async (req, res, next) => {
            // parse body to check the requested operation
            let controller;
            switch (req.body.operation) {
                case 'close':
                    try {
                        middlewares.auth.checkPermissions(['plan.close'], req, res, next, false);
                    } catch (error) {
                        return res.status(500).send({
                            success: false,
                        });
                    }

                    controller = controllers.plan.close;
                    break;

                default:
                    return res.status(404).send({});
            }

            // check charte
            try {
                await middlewares.charte.check(req, res, next, false);
            } catch (error) {
                return res.status(400).send({
                    user_message: error.message,
                });
            }

            // sync app-version
            try {
                await middlewares.appVersion.sync(req, res, next, false);
            } catch (error) {
                return res.status(500).send({});
            }

            // route to proper controller
            return controller(req, res, next);
        },
    );
    app.get(
        '/plans/comments/export',
        middlewares.auth.authenticate,
        (...args) => middlewares.auth.checkPermissions(['plan_comment.export'], ...args),
        middlewares.charte.check,
        middlewares.appVersion.sync,
        controllers.planComment.export,
    );

    // towns
    app.get(
        '/towns/export',
        middlewares.auth.authenticate,
        (...args) => middlewares.auth.checkPermissions(['shantytown.export'], ...args),
        middlewares.charte.check,
        validators.exportTowns,
        middlewares.validation,
        controllers.town.exportTown,
    );
    app.get(
        '/towns',
        middlewares.auth.authenticate,
        // (...args) => middlewares.auth.checkPermissions(['shantytown.list'], ...args),
        // middlewares.charte.check,
        // middlewares.appVersion.sync,
        controllers.town.list,
    );
    app.get(
        '/towns/:id',
        middlewares.auth.authenticate,
        (...args) => middlewares.auth.checkPermissions(['shantytown.read'], ...args),
        middlewares.charte.check,
        middlewares.appVersion.sync,
        controllers.town.find,
    );
    app.get(
        '/towns/:id/exports',
        middlewares.auth.authenticate,
        middlewares.shantytown.checkReadPermission,
        validators.exportTown,
        middlewares.validation,
        controllers.town.exportOne,
    );
    app.post(
        '/towns',
        middlewares.auth.authenticate,
        (...args) => middlewares.auth.checkPermissions(['shantytown.create'], ...args),
        middlewares.charte.check,
        middlewares.appVersion.sync,
        validators.createTown,
        middlewares.validation,
        controllers.town.create,
    );
    app.post(
        '/towns/:id',
        middlewares.auth.authenticate,
        (...args) => middlewares.auth.checkPermissions(['shantytown.update'], ...args),
        middlewares.charte.check,
        middlewares.appVersion.sync,
        validators.editTown,
        middlewares.validation,
        controllers.town.edit,
    );
    app.post(
        '/towns/:id/close',
        middlewares.auth.authenticate,
        (...args) => middlewares.auth.checkPermissions(['shantytown.close'], ...args),
        middlewares.charte.check,
        middlewares.appVersion.sync,
        validators.closeTown,
        middlewares.validation,
        controllers.town.close,
    );
    app.put(
        '/towns/:id/closedWithSolutions',
        middlewares.auth.authenticate,
        (...args) => middlewares.auth.checkPermissions(['shantytown.fix_status'], ...args),
        middlewares.charte.check,
        middlewares.appVersion.sync,
        validators.fixClosedStatus,
        middlewares.validation,
        controllers.town.fixClosedStatus,
    );
    app.put(
        '/towns/:id/heatwave',
        middlewares.auth.authenticate,
        middlewares.charte.check,
        middlewares.appVersion.sync,
        validators.setHeatwaveStatus,
        middlewares.validation,
        controllers.town.setHeatwaveStatus,
    );
    app.delete(
        '/towns/:id',
        middlewares.auth.authenticate,
        (...args) => middlewares.auth.checkPermissions(['shantytown.delete'], ...args),
        middlewares.charte.check,
        middlewares.appVersion.sync,
        controllers.town.deleteTown,
    );
    app.post(
        '/towns/:id/comments',
        middlewares.auth.authenticate,
        (req, res, next, respond = true) => {
            // Only check permissions for private comments
            if (req.body?.targets?.organizations?.length || req.body?.targets?.users?.length) {
                return middlewares.auth.checkPermissions(['shantytown_comment.createPrivate'], req, res, next, respond);
            }

            return next();
        },
        middlewares.charte.check,
        middlewares.appVersion.sync,
        validators.shantytownComment.createShantytownComment,
        middlewares.validation,
        controllers.shantytownComment.create,
    );
    app.post(
        '/towns/:id/covidComments',
        middlewares.auth.authenticate,
        middlewares.charte.check,
        middlewares.appVersion.sync,
        controllers.town.createCovidComment,
    );
    app.delete(
        '/towns/:id/comments/:commentId',
        middlewares.auth.authenticate,
        middlewares.charte.check,
        middlewares.appVersion.sync,
        controllers.town.deleteComment,
    );

    app.get(
        '/comments',
        middlewares.auth.authenticate,
        (...args) => middlewares.auth.checkPermissions(['shantytown_comment.export'], ...args),
        middlewares.charte.check,
        middlewares.appVersion.sync,
        controllers.shantytownComment.export,
    );

    // high covid comment
    app.post(
        '/high-covid-comments',
        middlewares.auth.authenticate,
        middlewares.charte.check,
        middlewares.appVersion.sync,
        controllers.town.createHighCovidComment,
    );

    app.patch(
        '/organizations/:id/being_funded',
        middlewares.auth.authenticate,
        middlewares.auth.isSuperAdmin,
        validators.editOrganization,
        middlewares.validation,
        controllers.organization.updateBeingFunded,
    );

    app.get(
        '/organizations/search',
        middlewares.auth.authenticate,
        middlewares.charte.check,
        middlewares.appVersion.sync,
        controllers.organization.search,
    );

    app.get(
        '/organization-categories',
        controllers.organization.categories,
    );

    app.get(
        '/organization-categories/:categoryId/organization-types',
        controllers.organization.types,
    );

    app.get(
        '/organization-categories/:categoryId/users',
        controllers.organization.getMembersByCategory,
    );

    app.get(
        '/organization-categories/:categoryId/organizations',
        controllers.organization.getByCategory,
    );

    app.get(
        '/organization-types/:typeId/organizations',
        controllers.organization.getByType,
    );

    app.get(
        '/organizations/:organizationId/users',
        controllers.organization.getMembers,
    );

    // pois
    app.get(
        '/pois',
        middlewares.auth.authenticate,
        middlewares.charte.check,
        middlewares.appVersion.sync,
        controllers.poi.findAll,
    );

    // geo
    app.get(
        '/locations/search',
        controllers.geo.search,
    );
    app.get(
        '/locations/:type/:code?',
        controllers.geo.get,
    );
    app.get(
        '/cities/search',
        middlewares.auth.authenticate,
        middlewares.appVersion.sync,
        controllers.geo.searchCities,
    );
    app.get(
        '/epci/search',
        middlewares.auth.authenticate,
        middlewares.appVersion.sync,
        controllers.geo.searchEpci,
    );
    app.get(
        '/departements',
        controllers.geo.listDepartements,
    );

    app.get(
        '/regions/:id/departements',
        controllers.geo.getDepartementsForRegion,
    );

    app.get(
        '/epci/:id/departements',
        controllers.geo.getDepartementsForEpci,
    );

    // dashboard

    app.get(
        '/stats/getStats',
        middlewares.auth.authenticate,
        (...args) => middlewares.auth.checkPermissions(['shantytown.list'], ...args),
        middlewares.charte.check,
        middlewares.appVersion.sync,
        validators.dashboard.location,
        controllers.stats.getDashboardStats,
    );

    // stats
    app.get(
        '/stats/:departement?',
        async (req, res, next) => {
            try {
                await middlewares.auth.authenticate(req, res, next, false);
            } catch (error) {
                return controllers.stats.public(req, res, next);
            }

            try {
                middlewares.auth.checkPermissions(['stats.read'], req, res, next, false);
            } catch (error) {
                res.status(500).send({
                    success: false,
                });
                return next(error);
            }

            await middlewares.appVersion.sync(req, res, next, false);
            return controllers.stats.all(req, res, next);
        },
    );

    app.get(
        '/statistics/export',
        middlewares.auth.authenticate,
        middlewares.auth.isSuperAdmin,
        middlewares.charte.check,
        middlewares.appVersion.sync,
        controllers.stats.export,
    );

    app.post(
        '/statistics/directory-views',
        middlewares.auth.authenticate,
        middlewares.charte.check,
        middlewares.appVersion.sync,
        controllers.stats.directoryView,
    );

    // user activities
    app.get(
        '/activities',
        middlewares.auth.authenticate,
        (...args) => middlewares.auth.checkOneOrMorePermissions(['shantytown.list', 'shantytown_comment.list', 'shantytown_comment.listPrivate'], ...args),
        middlewares.charte.check,
        middlewares.appVersion.sync,
        validators.activity.list,
        middlewares.validation,
        controllers.userActivity.regular,
    );

    app.get(
        '/contact-form-referrals',
        middlewares.auth.authenticate,
        (...args) => middlewares.auth.checkPermissions(['contact_form_referral.access'], ...args),
        middlewares.charte.check,
        middlewares.appVersion.sync,
        controllers.contactFormReferral.export,
    );
};
