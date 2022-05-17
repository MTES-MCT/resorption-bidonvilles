const getElectricityStatus = require('./electricity');
const getWaterStatus = require('./water');
const getTrashStatus = require('./trash');
const getSanitaryStatus = require('./sanitary');
const getVerminStatus = require('./vermin');
const getFirePreventionStatus = require('./firePrevention');

module.exports = town => ({
    electricity: getElectricityStatus(town),
    water: getWaterStatus(town),
    trash: getTrashStatus(town),
    sanitary: getSanitaryStatus(town),
    vermin: getVerminStatus(town),
    firePrevention: getFirePreventionStatus(town),
});
