const path = require('path');
const express = require('express');

// controllers
const { sequelize } = require('#db/models');
const models = require('#server/models')(sequelize);
const middlewares = require('#server/middlewares')(models);
const controllers = require('#server/controllers')(models);
const validators = require('#server/middlewares/validators');

module.exports = (app) => {
    app.use('/assets', express.static(path.resolve(__dirname, '../../assets')));

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
    app.get(
        '/users/:id',
        middlewares.auth.authenticate,
        (...args) => middlewares.auth.checkPermissions(['user.read'], ...args),
        middlewares.charte.check,
        middlewares.appVersion.sync,
        controllers.user.get,
    );
    app.put(
        '/users/:id/charte_engagement',
        middlewares.auth.authenticate,
        controllers.user.acceptCharte,
    );
    app.post(
        '/me/default-export',
        middlewares.auth.authenticate,
        middlewares.charte.check,
        middlewares.appVersion.sync,
        controllers.user.setDefaultExport,
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
                await middlewares.charte.check.sync(req, res, next, false);
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

    // towns
    app.get(
        '/towns/export',
        middlewares.auth.authenticate,
        (...args) => middlewares.auth.checkPermissions(['shantytown.export'], ...args),
        middlewares.charte.check,
        controllers.town.export,
    );
    app.get(
        '/towns',
        middlewares.auth.authenticate,
        (...args) => middlewares.auth.checkPermissions(['shantytown.list'], ...args),
        middlewares.charte.check,
        middlewares.appVersion.sync,
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
        controllers.town.close,
    );
    app.delete(
        '/towns/:id',
        middlewares.auth.authenticate,
        (...args) => middlewares.auth.checkPermissions(['shantytown.delete'], ...args),
        middlewares.charte.check,
        middlewares.appVersion.sync,
        controllers.town.delete,
    );
    app.post(
        '/towns/:id/comments',
        middlewares.auth.authenticate,
        (req, res, next, respond = true) => {
            // Only check permissions for private comments
            if (req.body.private) {
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

    // high covid comment
    app.post(
        '/high-covid-comments',
        middlewares.auth.authenticate,
        middlewares.charte.check,
        middlewares.appVersion.sync,
        controllers.town.createHighCovidComment,
    );

    // organizations
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

    app.post(
        '/statistics/directory-views',
        middlewares.auth.authenticate,
        middlewares.charte.check,
        middlewares.appVersion.sync,
        controllers.stats.directoryView,
    );

    // user activities
    app.get(
        '/user-activities',
        middlewares.auth.authenticate,
        async (req, res, next) => {
            // parse filters
            const { filters: rawFilters } = req.query;
            req.filters = {};

            if (rawFilters !== undefined) {
                req.filters = rawFilters.split(',').reduce((acc, filter) => {
                    const [key, value] = filter.split(':');
                    return Object.assign({}, acc, {
                        [key]: decodeURIComponent(value),
                    });
                }, {});
            }

            // check if filter covid is requested
            if (req.filters.covid === '1') {
                try {
                    middlewares.auth.checkPermissions(['covid_comment.list'], req, res, next, false);
                } catch (error) {
                    return undefined;
                }
            } else {
                try {
                    middlewares.auth.checkPermissions(['shantytown_comment.moderate'], req, res, next, false);
                } catch (error) {
                    return undefined;
                }
            }

            // check charte
            try {
                await middlewares.charte.check(req, res, next, false);
            } catch (error) {
                return res.status(400).send({
                    user_message: error.message,
                });
            }

            return next();
        },
        middlewares.appVersion.sync,
        controllers.userActivity.list,
    );
};
