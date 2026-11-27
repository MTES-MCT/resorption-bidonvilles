import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import controller from './action.listFinanceReaders';

export default function listFinanceReadersRoute(app: ApplicationWithCustomRoutes): void {
    app.customRoutes.get('/actions/:id/action-finances-readers', controller, undefined, {
        authenticate: true,
        multipart: false,
    });
}
