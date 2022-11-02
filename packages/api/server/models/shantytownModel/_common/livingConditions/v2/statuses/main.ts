import getElectricityStatus from './electricity';
import getWaterStatus from './water';
import getTrashStatus from './trash';
import getSanitaryStatus from './sanitary';
import getPestAnimalsStatus from './pest_animals';
import getFirePreventionStatus from './fire_prevention';

export default town => ({
    electricity: getElectricityStatus(town),
    water: getWaterStatus(town),
    trash: getTrashStatus(town),
    sanitary: getSanitaryStatus(town),
    pest_animals: getPestAnimalsStatus(town),
    fire_prevention: getFirePreventionStatus(town),
});
