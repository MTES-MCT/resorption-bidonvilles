const serializeActor = require('./serializeActor');
const findAll = require('./findAll');
const findAllByLocation = require('./findAllByLocation');
const addActor = require('./addActor');
const removeActor = require('./removeActor');
const updateThemes = require('./updateThemes');
const removeTheme = require('./removeTheme');

module.exports = () => ({
    serializeActor,
    findAll,
    findAllByLocation,
    addActor,
    removeActor,
    updateThemes,
    removeTheme,
});
