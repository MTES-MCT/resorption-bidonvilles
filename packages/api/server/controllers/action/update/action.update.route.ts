import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './action.update.validator';
import controller from './action.update';

export default function updateRoute(app: ApplicationWithCustomRoutes): void {
    app.customRoutes.patch('/actions/:id', controller, validator, {
        authenticate: true,
        multipart: false,
    });
}
