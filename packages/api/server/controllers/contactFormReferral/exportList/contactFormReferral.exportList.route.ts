import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import controller from './contactFormReferral.exportList';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/contact-form-referrals/export/csv', controller, undefined, {
        authenticate: true,
        multipart: false,
    });
};
