import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import controller from './location.epciDepartements';

export default function locationEpciGetEpciDepartements(app: ApplicationWithCustomRoutes): void {
    app.customRoutes.get('/locations/epci/:code/departements', controller, undefined, {
        authenticate: false,
        multipart: false,
    });
}
