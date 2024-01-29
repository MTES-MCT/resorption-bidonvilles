import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import controller from './user.setPassword';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.put('/users/:id/password', controller, undefined, {
        authenticate: false,
        multipart: false,
    });
};
