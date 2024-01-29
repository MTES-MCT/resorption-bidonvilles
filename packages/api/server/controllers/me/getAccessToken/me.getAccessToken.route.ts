import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import controller from './me.getAccessToken';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/me/access-tokens', controller, undefined, {
        authenticate: true,
        multipart: false,
    });
};
