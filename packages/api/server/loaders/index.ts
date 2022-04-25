import agendaJobs from './agendaJobsLoader';
import rateLimiter from './rateLimiterLoader';
import routes from './routesLoader';

const express = require('./expressLoader');
const agenda = require('./agendaLoader');

export default {
    express,
    routes,
    agenda,
    agendaJobs,
    rateLimiter,
};