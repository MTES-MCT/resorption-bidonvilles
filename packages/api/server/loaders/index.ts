import agendaJobs from './agendaJobsLoader';
import rateLimiter from './rateLimiterLoader';

const express = require('./expressLoader');
const routes = require('./routesLoader');
const agenda = require('./agendaLoader');

export default {
    express,
    routes,
    agenda,
    agendaJobs,
    rateLimiter,
};