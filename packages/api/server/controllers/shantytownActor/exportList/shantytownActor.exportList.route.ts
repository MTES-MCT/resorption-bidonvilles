import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import controller from './shantytownActor.exportList';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/actors/export/csv', controller, undefined, {
        authenticate: true,
        multipart: false,
    });
};
