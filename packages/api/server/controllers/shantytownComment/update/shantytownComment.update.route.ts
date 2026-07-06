import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import controller from './shantytownComment.update';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.put('/towns/:id/comments/:commentId', controller, undefined, {
        authenticate: true,
        multipart: false,
    });
};
