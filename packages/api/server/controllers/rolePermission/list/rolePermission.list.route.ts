import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import controller from './rolePermission.list';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/role-permissions', controller, undefined, {
        authenticate: true,
        multipart: false,
    });
};
