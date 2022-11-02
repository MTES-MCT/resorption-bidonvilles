import computeStatus from './computeStatus';
import isPiling from './trash/is_piling';
import evacuationIsclose from './trash/evacuation_is_close';
import evacuationIsRegular from './trash/evacuation_is_regular';
import evacuationIsSafe from './trash/evacuation_is_safe';
import bulkyIsPiling from './trash/bulky_is_piling';

export default town => computeStatus(town, {
    isPiling,
    evacuationIsclose,
    evacuationIsRegular,
    evacuationIsSafe,
    bulkyIsPiling,
});
