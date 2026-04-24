import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import controller from './user.listFavorites';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/users/me/favorites', controller, undefined, {
        authenticate: true,
        multipart: false,
    });
};
