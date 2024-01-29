import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './user.deactivate.validator';
import controller from './user.deactivate';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.post('/users/:id/deactivate', controller, validator, {
        authenticate: true,
        multipart: false,
    });
};
