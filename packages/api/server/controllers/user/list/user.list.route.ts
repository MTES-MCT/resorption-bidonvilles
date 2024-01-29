import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import controller from './user.list';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/users', controller, undefined, {
        authenticate: true,
        multipart: false,
    });
};
