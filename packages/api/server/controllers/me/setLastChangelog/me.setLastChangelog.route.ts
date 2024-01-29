import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import controller from './me.setLastChangelog';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.put('/me/last_changelog', controller, undefined, {
        authenticate: true,
        multipart: false,
    });
};
