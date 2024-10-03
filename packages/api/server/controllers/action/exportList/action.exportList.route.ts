import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import controller from './action.exportList';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/actions/export/excel', controller, undefined, {
        authenticate: true,
        multipart: false,
    });
};
