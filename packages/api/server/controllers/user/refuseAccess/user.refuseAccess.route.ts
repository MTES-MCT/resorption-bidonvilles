import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import controller from './user.refuseAccess';
import validator from './user.refuseAccess.validator';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.post('/users/:id/refuse-access', controller, validator, {
        authenticate: true,
        multipart: false,
    });
};
