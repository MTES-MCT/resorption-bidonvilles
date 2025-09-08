import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './metrics.getHexagone.validator';
import controller from './metrics.getHexagone';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/metrics/hexagone', controller, validator, {
        authenticate: true,
        multipart: false,
    });
};
