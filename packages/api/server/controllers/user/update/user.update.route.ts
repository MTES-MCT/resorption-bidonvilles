import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './user.update.validator';
import controller from './user.update';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.patch('/users/:id', controller, validator, {
        authenticate: true,
        multipart: false,
    });
};
