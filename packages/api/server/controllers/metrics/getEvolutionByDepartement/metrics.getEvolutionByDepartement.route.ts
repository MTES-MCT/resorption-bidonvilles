import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './metrics.getEvolutionByDepartement.validator';
import controller from './metrics.getEvolutionByDepartement';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/metrics/departement/:departement/evolution', controller, validator, {
        authenticate: true,
        multipart: false,
    });
};
