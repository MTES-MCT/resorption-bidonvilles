import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './metrics.getDepartementsSummary.validator';
import controller from './metrics.getDepartementsSummary';

const metricsGetDepartementsSummaryRoute = (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/metrics/departements/summary', controller, validator, {
        authenticate: true,
        multipart: false,
    });
};

export default metricsGetDepartementsSummaryRoute;
