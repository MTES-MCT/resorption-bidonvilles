import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import controller from './user.get';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/users/:id', controller, undefined, {
        authenticate: true,
        multipart: false,
    });
};
