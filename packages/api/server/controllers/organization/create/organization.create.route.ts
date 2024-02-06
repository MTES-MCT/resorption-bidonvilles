import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './organization.create.validator';
import controller from './organization.create';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.post('/organizations', controller, validator, {
        authenticate: true,
        multipart: false,
    });
};
