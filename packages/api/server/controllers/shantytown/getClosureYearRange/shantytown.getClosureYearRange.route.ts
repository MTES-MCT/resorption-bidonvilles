import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import controller from './shantytown.getClosureYearRange';

export default function getClosureYearRangeRoute(app: ApplicationWithCustomRoutes): void {
    app.customRoutes.get('/towns-metadata/closure-year-range', controller, undefined, {
        authenticate: true,
        multipart: false,
    });
}
