import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './organization.searchTerritorialCollectivities.validator';
import controller from './organization.searchTerritorialCollectivities';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/organizations/territorial-collectivities/search', controller, validator, {
        authenticate: false,
        multipart: false,
    });
};
