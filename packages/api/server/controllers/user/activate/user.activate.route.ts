import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import controller from './user.activate';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.post('/users/:id/activate', controller, undefined, {
        authenticate: false,
        multipart: false,
    });
};
