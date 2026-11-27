import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import controller from './action.exportList';
import validator from './action.exportList.validator';

export default function exportListRoute(app: ApplicationWithCustomRoutes): void {
    app.customRoutes.get('/actions/export/excel/:year', controller, validator, {
        authenticate: true,
        multipart: false,
    });
}
