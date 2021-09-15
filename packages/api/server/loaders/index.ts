import agendaJobs from './agendaJobsLoader';

const express = require('./expressLoader');
const routes = require('./routesLoader');
const agenda = require('./agendaLoader');

export default {
    express,
    routes,
    agenda,
    agendaJobs,
};
