import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './metrics.getByDepartement.validator';
import controller from './metrics.getByDepartement';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/metrics/departement/:departement', controller, validator, {
        authenticate: true,
        multipart: false,
    });
};
