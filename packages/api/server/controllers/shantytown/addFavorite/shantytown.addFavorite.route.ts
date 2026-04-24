import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './shantytown.addFavorite.validator';
import controller from './shantytown.addFavorite';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.post('/towns/:id/favorites', controller, validator, {
        authenticate: true,
        multipart: false,
    });
};
