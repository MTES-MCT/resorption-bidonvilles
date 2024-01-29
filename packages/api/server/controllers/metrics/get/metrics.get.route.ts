import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './metrics.get.validator';
import controller from './metrics.get';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/metrics', controller, validator, {
        authenticate: true,
        multipart: false,
    });
};
