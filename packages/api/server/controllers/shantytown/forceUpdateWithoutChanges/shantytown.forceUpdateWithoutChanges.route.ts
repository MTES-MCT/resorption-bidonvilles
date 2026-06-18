import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './shantytown.forceUpdateWithoutChanges.validator';
import controller from './shantytown.forceUpdateWithoutChanges';

export default function forceUpdate(app: ApplicationWithCustomRoutes): void {
    app.customRoutes.patch('/towns/:id/forcedupdate', controller, validator, {
        authenticate: true,
        multipart: false,
    });
}
