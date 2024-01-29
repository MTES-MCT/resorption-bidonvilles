import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './actionFinanceReader.listForNewAction.validator';
import controller from './actionFinanceReader.listForNewAction';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/action-finance-readers/departement/:departement', controller, validator, {
        authenticate: true,
        multipart: false,
    });
};
