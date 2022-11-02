import serializeV1 from './v1/serialize';
import serializeV2 from './v2/serialize';

const STRATEGIES = {
    1: serializeV1,
    2: serializeV2,
};

export default town => STRATEGIES[town.livingConditionsVersion](town);
