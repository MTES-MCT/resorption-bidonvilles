import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './shantytown.listJusticeReaders.validator';
import controller from './shantytown.listJusticeReaders';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/towns/:id/justice-readers', controller, validator, {
        authenticate: true,
        multipart: false,
    });
};
