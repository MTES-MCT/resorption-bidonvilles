import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './statistics.getDashboard.validator';
import controller from './statistics.getDashboard';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/statistics/dashboard', controller, validator, {
        authenticate: true,
        multipart: false,
    });
};
