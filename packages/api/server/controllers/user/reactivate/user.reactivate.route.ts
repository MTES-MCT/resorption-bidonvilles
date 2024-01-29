import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './user.reactivate.validator';
import controller from './user.reactivate';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.post('/users/:id/reactivate', controller, validator, {
        authenticate: true,
        multipart: false,
    });
};
