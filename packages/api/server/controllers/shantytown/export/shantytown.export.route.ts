import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './shantytown.export.validator';
import controller from './shantytown.export';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/towns/:id/export/word', controller, validator, {
        authenticate: true,
        multipart: false,
    });
};
