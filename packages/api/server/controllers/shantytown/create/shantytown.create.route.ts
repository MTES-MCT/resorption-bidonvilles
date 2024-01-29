import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './shantytown.create.validator';
import controller from './shantytown.create';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.post('/towns', controller, validator, {
        authenticate: true,
        multipart: false,
    });
};
