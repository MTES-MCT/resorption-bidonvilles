import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './shantytown.findNearby.validator';
import controller from './shantytown.findNearby';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/towns/nearby', controller, validator, {
        authenticate: true,
        multipart: false,
    });
};
