import agendaJobs from './agendaJobsLoader';
import rateLimiter from './rateLimiterLoader';
import routes from './routesLoader';

import express from './expressLoader';
import agenda from './agendaLoader';

export default {
    express,
    routes,
    agenda,
    agendaJobs,
    rateLimiter,
};
