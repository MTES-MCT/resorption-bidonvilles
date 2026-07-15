import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import listUserFavoritesController from './user.listFavorites';

export default function listUserFavoritesRoute(app: ApplicationWithCustomRoutes): void {
    app.customRoutes.get('/users/me/favorites', listUserFavoritesController, undefined, {
        authenticate: true,
        multipart: false,
    });
}
