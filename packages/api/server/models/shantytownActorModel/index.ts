import serializeActor from './serializeActor';
import findAll from './findAll';
import findAllByLocation from './findAllByLocation';
import addActor from './addActor';
import removeActor from './removeActor';
import updateThemes from './updateThemes';
import removeTheme from './removeTheme';

export default () => ({
    serializeActor,
    findAll,
    findAllByLocation,
    addActor,
    removeActor,
    updateThemes,
    removeTheme,
});
