import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import controller from './shantytownComment.exportList';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/shantytown-comments/export/csv', controller, undefined, {
        authenticate: true,
        multipart: false,
    });
};
