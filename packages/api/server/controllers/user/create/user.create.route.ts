import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './user.create.validator';
import controller from './user.create';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.post('/users', controller, validator, {
        authenticate: true,
        multipart: false,
    });
};
