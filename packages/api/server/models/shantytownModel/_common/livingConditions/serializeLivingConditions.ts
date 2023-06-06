import serializeV1 from './v1/serialize';
import serializeV2 from './v2/serialize';

import { LivingConditionsV1, LivingConditionsV2 } from './LivingConditions.d';

const STRATEGIES = {
    1: serializeV1,
    2: serializeV2,
};

export type LivingConditions = LivingConditionsV1 | LivingConditionsV2;

export default (town):LivingConditions => STRATEGIES[town.livingConditionsVersion](town);
