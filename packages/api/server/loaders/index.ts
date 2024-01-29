import agendaJobs from './agendaJobsLoader';
import rateLimiter from './rateLimiterLoader';
import routes from './routesLoader';

import express from './expressLoader';
import agenda from './agendaLoader';
import customRouteMethods from './customRouteMethodsLoader';
import s3 from './s3Loader';

export default {
    express,
    routes,
    agenda,
    agendaJobs,
    customRouteMethods,
    rateLimiter,
    s3,
};
