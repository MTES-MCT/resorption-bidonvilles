import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './shantytown.resorption.validator';
import controller from './shantytown.resorption';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.post('/towns/:id/resorption', controller, validator, {
        authenticate: true,
        multipart: false,
    });
};
