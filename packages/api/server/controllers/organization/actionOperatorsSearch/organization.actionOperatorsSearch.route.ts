import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './organization.actionOperatorsSearch.validator';
import controller from './organization.actionOperatorsSearch';

function registerActionOperatorsSearchRoute(app: ApplicationWithCustomRoutes): void {
    app.customRoutes.get('/organizations/search-action-operators', controller, validator, {
        authenticate: false,
        multipart: false,
    });
}

export default registerActionOperatorsSearchRoute;
