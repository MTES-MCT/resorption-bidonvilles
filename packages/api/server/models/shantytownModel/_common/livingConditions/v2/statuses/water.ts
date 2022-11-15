import computeStatus from './computeStatus';
import accessType from './water/access_type';
import accessIsPublic from './water/access_is_public';
import accessIsContinuous from './water/access_is_continuous';
import accessIsLocal from './water/access_is_local';
import accessIsClose from './water/access_is_close';
import accessIsUnequal from './water/access_is_unequal';
import accessHasStagnantWater from './water/access_has_stagnant_water';

export default town => computeStatus(town, {
    accessType,
    accessIsPublic,
    accessIsContinuous,
    accessIsLocal,
    accessIsClose,
    accessIsUnequal,
    accessHasStagnantWater,
});
