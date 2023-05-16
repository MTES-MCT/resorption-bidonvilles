import path from 'path';
import express from 'express';
import multer from 'multer';
import bodyParser from 'body-parser';

// controllers
import middlewares from '#server/middlewares';
import controllersFn from '#server/controllers';
import validators from '#server/middlewares/validators';

const controllers = controllersFn();
const upload = multer({
    storage: multer.memoryStorage(),
});

export default (app) => {
    app.use('/assets', express.static(path.resolve(__dirname, '../../assets')));

    app.get(
        '/',
        (req, res) => res.status(200).send('Bienvenue sur l\'API de Résorption Bidonvilles'),
    );
    app.post(
        '/signin',
        bodyParser.json(),
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
        bodyParser.json(),
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
        (...args: [express.Request, express.Response, Function]) => middlewares.auth.checkPermissions(['user.list'], ...args),
        middlewares.charte.check,
        middlewares.appVersion.sync,
        controllers.user.list,
    );

    app.get(
        '/users/export',
        middlewares.auth.authenticate,
        (...args: [express.Request, express.Response, Function]) => middlewares.auth.checkPermissions(['user.export'], ...args),
        controllers.user.listExport,
    );
    app.get(
        '/navigationLogs/mobile/export',
        middlewares.auth.authenticate,
        middlewares.auth.isSuperAdmin,
        controllers.userNavigationLogs.exportForMobile,

    );
    app.get(
        '/navigationLogs/webapp/export',
        middlewares.auth.authenticate,
        middlewares.auth.isSuperAdmin,
        controllers.userNavigationLogs.exportForWebapp,

    );
    app.get(
        '/me',
        middlewares.auth.authenticate,
        middlewares.appVersion.sync,
        controllers.user.me,
    );
    app.post(
        '/me',
        bodyParser.json(),
        middlewares.auth.authenticate,
        middlewares.charte.check,
        middlewares.appVersion.sync,
        validators.editUser,
        middlewares.validation,
        controllers.user.edit,
    );
    app.post(
        '/me/navigationLogs',
        bodyParser.json(),
        middlewares.auth.authenticate,
        middlewares.charte.check,
        middlewares.appVersion.sync,
        validators.me.postNavigationLogs,
        middlewares.validation,
        controllers.userNavigationLogs.insert,
    );
    app.post(
        '/questions',
        bodyParser.json(),
        middlewares.auth.authenticate,
        middlewares.charte.check,
        middlewares.appVersion.sync,
        validators.question.createQuestion,
        middlewares.validation,
        controllers.question.create,
    );
    app.get(
        '/questions',
        middlewares.auth.authenticate,
        middlewares.charte.check,
        middlewares.appVersion.sync,
        controllers.question.list,
    );
    app.get(
        '/questions/:id',
        middlewares.auth.authenticate,
        middlewares.charte.check,
        middlewares.appVersion.sync,
        controllers.question.fetch,
    );
    app.post(
        '/questions/:id/answers',
        bodyParser.json(),
        middlewares.auth.authenticate,
        middlewares.charte.check,
        middlewares.appVersion.sync,
        validators.answer.createAnswer,
        middlewares.validation,
        controllers.answer.create,
    );
    app.get(
        '/users/:id',
        middlewares.auth.authenticate,
        (...args: [express.Request, express.Response, Function]) => middlewares.auth.checkPermissions(['user.read'], ...args),
        middlewares.charte.check,
        middlewares.appVersion.sync,
        controllers.user.get,
    );
    app.put(
        '/users/:id',
        bodyParser.json(),
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
        bodyParser.json(),
        middlewares.auth.authenticate,
        controllers.user.acceptCharte,
    );
    app.post(
        '/users',
        bodyParser.json(),
        middlewares.auth.authenticate,
        (...args: [express.Request, express.Response, Function]) => middlewares.auth.checkPermissions(['user.create'], ...args),
        middlewares.charte.check,
        middlewares.appVersion.sync,
        validators.createUser,
        middlewares.validation,
        controllers.user.create,
    );
    app.post(
        '/contact',
        bodyParser.json(),
        validators.createContact,
        middlewares.validation,
        controllers.contact.contact,
    );
    app.post(
        '/invite',
        bodyParser.json(),
        validators.invite,
        middlewares.validation,
        controllers.invite.invite,
    );
    app.post(
        '/users/:id/sendActivationLink',
        bodyParser.json(),
        middlewares.auth.authenticate,
        (...args: [express.Request, express.Response, Function]) => middlewares.auth.checkPermissions(['user.activate'], ...args),
        middlewares.charte.check,
        middlewares.appVersion.sync,
        controllers.user.sendActivationLink,
    );
    app.get(
        '/users/:id/activationLink',
        middlewares.auth.authenticate,
        (...args: [express.Request, express.Response, Function]) => middlewares.auth.checkPermissions(['user.activate'], ...args),
        middlewares.charte.check,
        middlewares.appVersion.sync,
        validators.user.getLatestActivationLink,
        middlewares.validation,
        controllers.user.getLatestActivationLink,
    );
    app.post(
        '/users/:id/denyAccess',
        bodyParser.json(),
        middlewares.auth.authenticate,
        (...args: [express.Request, express.Response, Function]) => middlewares.auth.checkPermissions(['user.activate'], ...args),
        middlewares.charte.check,
        middlewares.appVersion.sync,
        controllers.user.denyAccess,
    );
    app.post(
        '/users/:id/activate',
        bodyParser.json(),
        controllers.user.activate,
    );
    app.post(
        '/users/:id/upgrade',
        bodyParser.json(),
        middlewares.auth.authenticate,
        middlewares.appVersion.sync,
        controllers.user.upgrade,
    );
    app.post(
        '/users/:id/options',
        bodyParser.json(),
        middlewares.auth.authenticate,
        (...args: [express.Request, express.Response, Function]) => middlewares.auth.checkPermissions(['user.activate'], ...args),
        middlewares.appVersion.sync,
        validators.user.updatePermissionOptions,
        middlewares.validation,
        controllers.user.updatePermissionOptions,
    );
    app.put(
        '/users/:id/admin_comments',
        bodyParser.json(),
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
        bodyParser.json(),
        middlewares.auth.authenticate,
        (...args: [express.Request, express.Response, Function]) => middlewares.auth.checkPermissions(['user.deactivate'], ...args),
        middlewares.charte.check,
        middlewares.appVersion.sync,
        controllers.user.remove,
    );
    app.post(
        '/users/:id/local-admin',
        bodyParser.json(),
        middlewares.auth.authenticate,
        middlewares.auth.isSuperAdmin,
        controllers.user.updateLocalAdmin,
    );
    app.patch(
        '/users/:id/role_regular',
        bodyParser.json(),
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
        bodyParser.json(),
        controllers.user.requestNewPassword,
    );
    app.get(
        '/password-tokens/:token/check',
        controllers.user.checkPasswordToken,
    );
    app.post(
        '/users/:id/newPassword',
        bodyParser.json(),
        controllers.user.setNewPassword,
    );

    // shantytown actors
    app.post(
        '/towns/:id/actors',
        bodyParser.json(),
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
        bodyParser.json(),
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
        bodyParser.json(),
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
        bodyParser.json(),
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
        bodyParser.json(),
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
        (...args: [express.Request, express.Response, Function]) => middlewares.auth.checkPermissions(['shantytown_actor.export'], ...args),
        middlewares.charte.check,
        middlewares.appVersion.sync,
        controllers.town.exportActors,
    );

    app.get(
        '/users/:id/towns',
        middlewares.auth.authenticate,
        (...args: [express.Request, express.Response, Function]) => middlewares.auth.checkPermissions(['shantytown.list'], ...args),
        middlewares.charte.check,
        middlewares.appVersion.sync,
        validators.findUserTowns,
        middlewares.validation,
        controllers.town.findUserTowns,
    );

    app.get(
        '/towns/findNearby',
        validators.findNearbyTowns,
        middlewares.auth.authenticate,
        (...args: [express.Request, express.Response, Function]) => middlewares.auth.checkPermissions(['shantytown.list'], ...args),
        middlewares.charte.check,
        middlewares.appVersion.sync,
        controllers.town.findNearbyTowns,
    );

    // actions
    app.get(
        '/actions',
        middlewares.auth.authenticate,
        (...args: [express.Request, express.Response, Function]) => middlewares.auth.checkPermissions(['action.read'], ...args),
        controllers.action.list,
    );
    app.get(
        '/actions/export',
        middlewares.auth.authenticate,
        (...args: [express.Request, express.Response, Function]) => middlewares.auth.checkPermissions(['action.export'], ...args),
        middlewares.charte.check,
        middlewares.appVersion.sync,
        controllers.action.exportActions,
    );
    app.get(
        '/actions/:id',
        middlewares.auth.authenticate,
        (...args: [express.Request, express.Response, Function]) => middlewares.auth.checkPermissions(['action.read'], ...args),
        controllers.action.fetchOne,
    );
    app.get(
        '/actions/:id/action-finances-readers',
        middlewares.auth.authenticate,
        middlewares.validation,
        controllers.action.findActionFinancesReadersByAction,
    );
    app.post(
        '/action-finances-readers',
        bodyParser.json(),
        middlewares.auth.authenticate,
        middlewares.validation,
        controllers.action.findActionFinancesReadersByManagers,
    );

    app.post(
        '/actions',
        bodyParser.json(),
        middlewares.auth.authenticate,
        (...args: [express.Request, express.Response, Function]) => middlewares.auth.checkPermissions(['action.create'], ...args),
        validators.action.create,
        middlewares.validation,
        controllers.action.create,
    );
    app.patch(
        '/actions/:id',
        bodyParser.json(),
        middlewares.auth.authenticate,
        (...args: [express.Request, express.Response, Function]) => middlewares.auth.checkPermissions(['action.update'], ...args),
        validators.action.update,
        middlewares.validation,
        controllers.action.update,
    );
    app.post(
        '/actions/:id/comments',
        bodyParser.json(),
        middlewares.auth.authenticate,
        (...args: [express.Request, express.Response, Function]) => middlewares.auth.checkPermissions(['action_comment.create'], ...args),
        validators.action.createComment,
        middlewares.validation,
        controllers.action.createComment,
    );
    app.get(
        '/actions/comments/export',
        middlewares.auth.authenticate,
        (...args: [express.Request, express.Response, Function]) => middlewares.auth.checkPermissions(['action_comment.export'], ...args),
        middlewares.charte.check,
        middlewares.appVersion.sync,
        controllers.action.exportComments,
    );

    // towns
    app.get(
        '/towns/export',
        middlewares.auth.authenticate,
        (...args: [express.Request, express.Response, Function]) => middlewares.auth.checkPermissions(['shantytown.export'], ...args),
        middlewares.charte.check,
        validators.exportTowns,
        middlewares.validation,
        controllers.town.exportTown,
    );
    app.get(
        '/towns',
        middlewares.auth.authenticate,
        (...args: [express.Request, express.Response, Function]) => middlewares.auth.checkPermissions(['shantytown.list'], ...args),
        middlewares.charte.check,
        middlewares.appVersion.sync,
        controllers.town.list,
    );
    app.get(
        '/towns/:id',
        middlewares.auth.authenticate,
        (...args: [express.Request, express.Response, Function]) => middlewares.auth.checkPermissions(['shantytown.read'], ...args),
        middlewares.charte.check,
        middlewares.appVersion.sync,
        controllers.town.find,
    );
    app.get(
        '/justice-readers/:locationType/:locationCode',
        middlewares.auth.authenticate,
        validators.justiceReader.findByLocation,
        middlewares.validation,
        controllers.organization.findJusticeReadersByLocation,
    );
    app.get(
        '/towns/:id/justice_readers',
        middlewares.auth.authenticate,
        middlewares.shantytown.checkReadPermission,
        controllers.town.findJusticeReaders,
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
        bodyParser.json(),
        middlewares.auth.authenticate,
        (...args: [express.Request, express.Response, Function]) => middlewares.auth.checkPermissions(['shantytown.create'], ...args),
        middlewares.charte.check,
        middlewares.appVersion.sync,
        validators.createTown,
        middlewares.validation,
        controllers.town.create,
    );
    app.post(
        '/towns/report',
        bodyParser.json(),
        middlewares.auth.authenticate,
        (...args: [express.Request, express.Response, Function]) => middlewares.auth.checkPermissions(['shantytown.report'], ...args),
        middlewares.charte.check,
        middlewares.appVersion.sync,
        validators.reportTown,
        middlewares.validation,
        controllers.town.report,
    );
    app.post(
        '/towns/:id',
        bodyParser.json(),
        middlewares.auth.authenticate,
        (...args: [express.Request, express.Response, Function]) => middlewares.auth.checkPermissions(['shantytown.update'], ...args),
        middlewares.charte.check,
        middlewares.appVersion.sync,
        validators.editTown,
        middlewares.validation,
        controllers.town.edit,
    );
    app.post(
        '/towns/:id/close',
        bodyParser.json(),
        middlewares.auth.authenticate,
        (...args: [express.Request, express.Response, Function]) => middlewares.auth.checkPermissions(['shantytown.close'], ...args),
        middlewares.charte.check,
        middlewares.appVersion.sync,
        validators.closeTown,
        middlewares.validation,
        controllers.town.close,
    );
    app.put(
        '/towns/:id/closedWithSolutions',
        bodyParser.json(),
        middlewares.auth.authenticate,
        (...args: [express.Request, express.Response, Function]) => middlewares.auth.checkPermissions(['shantytown.fix_status'], ...args),
        middlewares.charte.check,
        middlewares.appVersion.sync,
        validators.fixClosedStatus,
        middlewares.validation,
        controllers.town.fixClosedStatus,
    );
    app.put(
        '/towns/:id/heatwave',
        bodyParser.json(),
        middlewares.auth.authenticate,
        middlewares.charte.check,
        middlewares.appVersion.sync,
        validators.setHeatwaveStatus,
        middlewares.validation,
        controllers.town.setHeatwaveStatus,
    );
    app.delete(
        '/towns/:id',
        bodyParser.json(),
        middlewares.auth.authenticate,
        (...args: [express.Request, express.Response, Function]) => middlewares.auth.checkPermissions(['shantytown.delete'], ...args),
        middlewares.charte.check,
        middlewares.appVersion.sync,
        controllers.town.deleteTown,
    );
    app.post(
        '/towns/:id/comments',
        middlewares.auth.authenticate,
        (...args: [express.Request, express.Response, Function]) => middlewares.auth.checkPermissions(['shantytown_comment.create'], ...args),
        middlewares.charte.check,
        middlewares.appVersion.sync,
        upload.array('attachments'),
        (req, res, next) => {
            req.body = JSON.parse(req.body.content);
            next();
        },
        validators.shantytownComment.createShantytownComment,
        middlewares.validation,
        controllers.shantytownComment.create,
    );
    app.delete(
        '/towns/:id/comments/:commentId',
        bodyParser.json(),
        middlewares.auth.authenticate,
        middlewares.charte.check,
        middlewares.appVersion.sync,
        controllers.town.deleteComment,
    );

    app.get(
        '/comments',
        middlewares.auth.authenticate,
        (...args: [express.Request, express.Response, Function]) => middlewares.auth.checkPermissions(['shantytown_comment.export'], ...args),
        middlewares.charte.check,
        middlewares.appVersion.sync,
        controllers.shantytownComment.export,
    );

    app.patch(
        '/organizations/:id/being_funded',
        bodyParser.json(),
        middlewares.auth.authenticate,
        middlewares.auth.isSuperAdmin,
        validators.editOrganization,
        middlewares.validation,
        controllers.organization.updateBeingFunded,
    );

    app.get(
        '/organizations/search',
        middlewares.auth.authenticate,
        validators.organization.search,
        middlewares.validation,
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
        '/departements',
        controllers.geo.listDepartements,
    );

    // dashboard

    app.get(
        '/stats/getStats',
        middlewares.auth.authenticate,
        (...args: [express.Request, express.Response, Function]) => middlewares.auth.checkPermissions(['shantytown.list'], ...args),
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
                return controllers.stats.public(req, res);
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
            return controllers.stats.all(req, res);
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
        bodyParser.json(),
        middlewares.auth.authenticate,
        middlewares.charte.check,
        middlewares.appVersion.sync,
        controllers.stats.directoryView,
    );

    // user activities
    app.get(
        '/activities',
        middlewares.auth.authenticate,
        (...args: [express.Request, express.Response, Function]) => middlewares.auth.checkOneOrMorePermissions(['shantytown.list', 'shantytown_comment.list', 'shantytown_comment.listPrivate'], ...args),
        middlewares.charte.check,
        middlewares.appVersion.sync,
        validators.activity.list,
        middlewares.validation,
        controllers.userActivity.regular,
    );

    app.get(
        '/contact-form-referrals',
        middlewares.auth.authenticate,
        (...args: [express.Request, express.Response, Function]) => middlewares.auth.checkPermissions(['contact_form_referral.access'], ...args),
        middlewares.charte.check,
        middlewares.appVersion.sync,
        controllers.contactFormReferral.export,
    );

    // Notes (mobile)
    app.post(
        '/notes',
        bodyParser.json(),
        middlewares.auth.authenticate,
        middlewares.charte.check,
        middlewares.appVersion.sync,
        validators.note.createNote,
        middlewares.validation,
        controllers.note.create,
    );

    app.patch(
        '/notes/:id/number_of_copies',
        bodyParser.json(),
        middlewares.auth.authenticate,
        middlewares.charte.check,
        middlewares.appVersion.sync,
        controllers.note.addCopy,
    );

    app.post(
        '/notes/:id/publications',
        bodyParser.json(),
        middlewares.auth.authenticate,
        middlewares.charte.check,
        middlewares.appVersion.sync,
        validators.note.publishNote,
        middlewares.validation,
        controllers.note.addPublication,
    );

    app.post(
        '/communaute/ad',
        bodyParser.json(),
        middlewares.auth.authenticate,
        middlewares.auth.isSuperAdmin,
        controllers.community.ad,
    );

    app.put(
        '/questions/:id/subscription',
        bodyParser.json(),
        middlewares.auth.authenticate,
        middlewares.charte.check,
        middlewares.appVersion.sync,
        validators.question.subscribeQuestion,
        middlewares.validation,
        controllers.community.subscribe,
    );

    app.delete(
        '/questions/:id/subscription',
        bodyParser.json(),
        middlewares.auth.authenticate,
        middlewares.charte.check,
        middlewares.appVersion.sync,
        validators.question.subscribeQuestion,
        middlewares.validation,
        controllers.community.unsubscribe,
    );
};
