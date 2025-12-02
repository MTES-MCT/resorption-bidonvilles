import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import controller from './action.requestPilot';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/actions/:id/requestPilot', controller, undefined, {
        authenticate: true,
        multipart: false,
    });
};
