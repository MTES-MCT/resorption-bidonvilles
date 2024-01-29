import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './shantytown.exportList.validator';
import controller from './shantytown.exportList';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/towns/export/excel', controller, validator, {
        authenticate: true,
        multipart: false,
    });
};
