import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './shantytown.close.validator';
import controller from './shantytown.close';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.post('/towns/:id/close', controller, validator, {
        authenticate: true,
        multipart: false,
    });
};
