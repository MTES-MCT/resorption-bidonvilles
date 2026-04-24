import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import listFavoritesController from './user.listFavorites';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/users/me/favorites', listFavoritesController, undefined, {
        authenticate: true,
        multipart: false,
    });
};
