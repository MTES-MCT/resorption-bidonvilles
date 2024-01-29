import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import controller from './user.setRoleAdmin';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.put('/users/:id/role-admin', controller, undefined, {
        authenticate: true,
        multipart: false,
    });
};
