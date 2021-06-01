const express = require('./expressLoader');
const routes = require('./routesLoader');
const agenda = require('./agendaLoader');
const agendaJobs = require('./agendaJobsLoader');

module.exports = {
    express,
    routes,
    agenda,
    agendaJobs,
};
