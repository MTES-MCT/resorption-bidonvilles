import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './shantytown.getDecrees.validator';
import controller from './shantytown.getDecrees';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/shantytownDecrees/:id', controller, [validator], {
        authenticate: true,
        multipart: false,
    });
};
