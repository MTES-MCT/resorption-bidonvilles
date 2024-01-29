import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './user.setRoleRegular.validator';
import controller from './user.setRoleRegular';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.put('/users/:id/role-regular', controller, validator, {
        authenticate: true,
        multipart: false,
    });
};
