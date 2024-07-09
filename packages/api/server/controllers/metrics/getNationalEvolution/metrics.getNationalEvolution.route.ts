import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './metrics.getNationalEvolution.validator';
import controller from './metrics.getNationalEvolution';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/metrics/national/evolution', controller, validator, {
        authenticate: true,
        multipart: false,
    });
};
