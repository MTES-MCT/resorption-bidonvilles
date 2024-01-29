import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './contact.create.validator';
import controller from './contact.create';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.post('/contact', controller, validator, {
        authenticate: false,
        multipart: false,
    });
};
