import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import controller from './navigationLog.exportList';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/navigation-logs/export/csv', controller, undefined, {
        authenticate: true,
        multipart: false,
    });
};
