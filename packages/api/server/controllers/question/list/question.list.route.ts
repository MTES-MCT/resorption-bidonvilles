import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import controller from './question.list';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/questions', controller, undefined, {
        authenticate: true,
        multipart: false,
    });
};
