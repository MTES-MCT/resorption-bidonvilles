import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import controller from './actionComment.exportList';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/action-comments/export/csv', controller, undefined, {
        authenticate: true,
        multipart: false,
    });
};
