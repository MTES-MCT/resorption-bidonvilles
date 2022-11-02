import computeStatus from './computeStatus';
import openAirDefecation from './sanitary/open_air_defecation';
import workingToilets from './sanitary/working_toilets';
import toiletTypes from './sanitary/toilet_types';
import toiletsAreInside from './sanitary/toilets_are_inside';
import toiletsAreLighted from './sanitary/toilets_are_lighted';
import handWashing from './sanitary/hand_washing';

export default town => computeStatus(town, {
    openAirDefecation,
    workingToilets,
    toiletTypes,
    toiletsAreInside,
    toiletsAreLighted,
    handWashing,
});
