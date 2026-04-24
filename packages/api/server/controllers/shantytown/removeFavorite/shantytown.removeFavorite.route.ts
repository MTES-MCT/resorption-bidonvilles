import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './shantytown.removeFavorite.validator';
import controller from './shantytown.removeFavorite';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.delete('/towns/:id/favorites', controller, validator, {
        authenticate: true,
        multipart: false,
    });
};
