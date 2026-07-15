import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './shantytown.addFavorite.validator';
import addFavoriteController from './shantytown.addFavorite';

export default function addFavoriteRoute(app: ApplicationWithCustomRoutes): void {
    app.customRoutes.post('/towns/:id/favorites', addFavoriteController, validator, {
        authenticate: true,
        multipart: false,
    });
}
