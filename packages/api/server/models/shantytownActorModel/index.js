const serializeActor = require('./serializeActor');
const findAll = require('./findAll');
const addActor = require('./addActor');
const removeActor = require('./removeActor');
const updateThemes = require('./updateThemes');
const removeTheme = require('./removeTheme');

module.exports = () => ({
    serializeActor,
    findAll,
    addActor,
    removeActor,
    updateThemes,
    removeTheme,
});
