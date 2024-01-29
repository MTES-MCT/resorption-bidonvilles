import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import controller from './action.listFinanceReaders';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/actions/:id/action-finances-readers', controller, undefined, {
        authenticate: true,
        multipart: false,
    });
};
