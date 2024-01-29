import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './user.setAdminComments.validator';
import controller from './user.setAdminComments';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.put('/users/:id/admin-comments', controller, validator, {
        authenticate: true,
        multipart: false,
    });
};
