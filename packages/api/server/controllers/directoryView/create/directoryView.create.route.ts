import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import controller from './directoryView.create';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.post('/directory-views', controller, undefined, {
        authenticate: true,
        multipart: false,
    });
};
