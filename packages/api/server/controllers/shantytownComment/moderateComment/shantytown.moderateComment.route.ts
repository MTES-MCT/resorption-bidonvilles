import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import controller from './shantytown.moderateComment';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.delete('/towns/:id/comments/:commentId', controller, undefined, {
        authenticate: true,
        multipart: false,
    });
};
