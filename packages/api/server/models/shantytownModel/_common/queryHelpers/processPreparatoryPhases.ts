import { ShantytownPreparatoryPhaseTowardResorption } from '#root/types/resources/ShantytownPreparatoryPhasesTowardResorption.d';
import { Shantytown } from '#root/types/resources/Shantytown.d';

const INITIAL_PHASE_UIDS = new Set([
    'sociological_diagnosis',
    'social_assessment',
    'political_validation',
]);

type TownPhase = {
    townId: number;
    preparatoryPhases: ShantytownPreparatoryPhaseTowardResorption[];
};

export default function processPreparatoryPhases(
    townsHash: { [key: number]: Shantytown },
    townsPhasesTowardResorption: TownPhase[],
): void {
    /* eslint-disable no-param-reassign */
    townsPhasesTowardResorption.forEach((elt) => {
        if (elt.preparatoryPhases?.length > 0) {
            townsHash[elt.townId].preparatoryPhasesTowardResorption = elt.preparatoryPhases;
        }
    });

    Object.keys(townsHash).forEach((shantytownId) => {
        const phases: ShantytownPreparatoryPhaseTowardResorption[] = townsHash[shantytownId].preparatoryPhasesTowardResorption;
        if (phases?.length > 0) {
            const validPhases = phases.filter(p => p !== null && p !== undefined);
            townsHash[shantytownId].preparatoryPhasesTowardResorption = validPhases;

            const initialPhasesPresent = validPhases
                .filter(p => INITIAL_PHASE_UIDS.has(p.preparatoryPhaseId))
                .map(p => p.preparatoryPhaseId);

            townsHash[shantytownId].hasInitialResorptionPhases = initialPhasesPresent.length === 3;
        }
    });
    /* eslint-enable no-param-reassign */
}
