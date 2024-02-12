import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './organization.get.validator';
import controller from './organization.get';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/organizations/:id', controller, validator, {
        authenticate: true,
        multipart: false,
    });
};
