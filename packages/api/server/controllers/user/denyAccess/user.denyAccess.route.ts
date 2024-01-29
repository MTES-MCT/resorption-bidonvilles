import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import controller from './user.denyAccess';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.post('/users/:id/deny-access', controller, undefined, {
        authenticate: true,
        multipart: false,
    });
};
