const getElectricityStatus = require('./electricity');
const getWaterStatus = require('./water');
const getTrashStatus = require('./trash');
const getSanitaryStatus = require('./sanitary');
const getPestAnimalsStatus = require('./pest_animals');
const getFirePreventionStatus = require('./fire_prevention');

module.exports = town => ({
    electricity: getElectricityStatus(town),
    water: getWaterStatus(town),
    trash: getTrashStatus(town),
    sanitary: getSanitaryStatus(town),
    pest_animals: getPestAnimalsStatus(town),
    fire_prevention: getFirePreventionStatus(town),
});
