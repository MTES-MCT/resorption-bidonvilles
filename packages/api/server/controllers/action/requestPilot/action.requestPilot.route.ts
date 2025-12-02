import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import controller from './action.requestPilot';

const requestPilotRoute = (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/actions/:id/requestPilot', controller, undefined, {
        authenticate: true,
        multipart: false,
    });
};

export default requestPilotRoute;
