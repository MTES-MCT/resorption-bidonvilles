import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import controller from './organization.list';

const listAll = (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/organizations/organizations/search', controller, undefined, {
        authenticate: false,
        multipart: false,
    });
};

export default listAll;
