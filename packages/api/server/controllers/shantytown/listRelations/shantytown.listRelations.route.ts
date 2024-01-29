import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './shantytown.listRelations.validator';
import controller from './shantytown.listRelations';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/towns/:id/relations', controller, validator, {
        authenticate: true,
        multipart: false,
    });
};
