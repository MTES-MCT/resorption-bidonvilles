import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './shantytown.addActor.validator';
import controller from './shantytown.addActor';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.post('/towns/:id/actors', controller, validator, {
        authenticate: true,
        multipart: false,
    });
};
