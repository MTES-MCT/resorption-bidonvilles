import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import removeFavoriteController from './shantytown.removeFavorite';
import validator from './shantytown.removeFavorite.validator';

export default function removeFavoriteRoute(app: ApplicationWithCustomRoutes): void {
    app.customRoutes.delete('/towns/:id/favorites', removeFavoriteController, validator, {
        authenticate: true,
        multipart: false,
    });
}
