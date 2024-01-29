import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import controller from './user.exportList';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/users/export/csv', controller, undefined, {
        authenticate: true,
        multipart: false,
    });
};
