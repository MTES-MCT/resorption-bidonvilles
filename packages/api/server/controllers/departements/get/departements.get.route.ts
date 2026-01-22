import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import controller from './departements.get';

const getDepartements = (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/departements', controller, undefined, {
        authenticate: false,
        multipart: false,
    });
};

export default getDepartements;
