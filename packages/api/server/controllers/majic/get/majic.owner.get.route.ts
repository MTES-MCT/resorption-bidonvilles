import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import controller from './majic.owner.get';
import validator from './majic.owner.get.validator';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/majic', controller, validator, {
        authenticate: true,
        multipart: false,
    });
};
