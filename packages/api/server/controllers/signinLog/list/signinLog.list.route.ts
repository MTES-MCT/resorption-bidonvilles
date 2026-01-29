import bodyParser from 'body-parser';
import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import { authenticate, isAdmin } from '#server/middlewares/authMiddleware';
import controller from './signinLog.list';

export default (app: ApplicationWithCustomRoutes): void => {
    app.get('/signin-logs', bodyParser.json(), authenticate, isAdmin, controller);
};
