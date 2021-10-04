const getDepartementsFor = require('./getDepartementsFor');
const getLocation = require('./getLocation');
const search = require('./search');

module.exports = () => ({
    getDepartementsFor,
    getLocation,
    search,
});
