import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import controller from './actionComment.deleteComment';

export default function deleteCommentRoute(app: ApplicationWithCustomRoutes): void {
    app.customRoutes.delete('/actions/:id/comments/:commentId', controller, undefined, {
        authenticate: true,
        multipart: false,
    });
}
