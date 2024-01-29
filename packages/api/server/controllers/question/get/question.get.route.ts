import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import controller from './question.get';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/questions/:id', controller, undefined, {
        authenticate: true,
        multipart: false,
    });
};
