import getElectricityStatus from './electricity';
import getWaterStatus from './water';
import getTrashStatus from './trash';
import getSanitaryStatus from './sanitary';
import getVerminStatus from './vermin';
import getFirePreventionStatus from './firePrevention';

export default town => ({
    electricity: getElectricityStatus(town),
    water: getWaterStatus(town),
    trash: getTrashStatus(town),
    sanitary: getSanitaryStatus(town),
    vermin: getVerminStatus(town),
    firePrevention: getFirePreventionStatus(town),
});
