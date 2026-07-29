import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import controller from './shantytownComment.moderateComment';

export default function moderateCommentRoute(app: ApplicationWithCustomRoutes): void {
    app.customRoutes.delete('/towns/:id/comments/:commentId', controller, undefined, {
        authenticate: true,
        multipart: false,
    });
}
