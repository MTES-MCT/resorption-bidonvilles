import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './user.setOptions.validator';
import controller from './user.setOptions';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.put('/users/:id/options', controller, validator, {
        authenticate: true,
        multipart: false,
    });
};
