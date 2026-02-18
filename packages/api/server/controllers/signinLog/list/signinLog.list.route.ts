import bodyParser from 'body-parser';
import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import { authenticate, isAdmin } from '#server/middlewares/authMiddleware';
import controller from './signinLog.list';

export const signinLogListRoute = (app: ApplicationWithCustomRoutes): void => {
    app.get('/signin-logs', bodyParser.json(), authenticate, isAdmin, controller);
};

export default signinLogListRoute;
