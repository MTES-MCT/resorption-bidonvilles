import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import controller from './metrics.prom';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/prom_metrics', controller, undefined, {
        authenticate: true,
        multipart: false,
    });
};
