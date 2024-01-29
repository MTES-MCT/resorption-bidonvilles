import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import controller from './me.acceptCharter';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.put('/me/charte_engagement', controller, undefined, {
        authenticate: true,
        multipart: false,
    });
};
