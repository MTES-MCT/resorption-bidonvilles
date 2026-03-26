import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import controller from './territory.get';

const getTerritory = (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/territory/:type', controller, undefined, {
        authenticate: false,
        multipart: false,
    });
};

export default getTerritory;
