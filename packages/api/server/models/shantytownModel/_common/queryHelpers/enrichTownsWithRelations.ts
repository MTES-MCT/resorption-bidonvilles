import { Shantytown } from '#root/types/resources/Shantytown.d';
import { ShantytownAction } from '#root/types/resources/Action.d';

type RelatedData = {
    comments: { [key: string]: any[] };
    closingSolutions: any[];
    actors: any[];
    actions: ShantytownAction[];
    incomingTowns: any[];
};

export default function enrichTownsWithRelations(
    townsHash: { [key: number]: Shantytown },
    relatedData: RelatedData,
): void {
    const {
        comments, closingSolutions, actors, actions, incomingTowns,
    } = relatedData;

    Object.keys(townsHash).forEach((shantytownId) => {
        // eslint-disable-next-line no-param-reassign
        townsHash[shantytownId].comments = comments[shantytownId] ?? [];
    });

    closingSolutions.forEach((closingSolution) => {
        townsHash[closingSolution.shantytownId].closingSolutions.push({
            id: closingSolution.id,
            peopleAffected: closingSolution.peopleAffected,
            householdsAffected: closingSolution.householdsAffected,
            message: closingSolution.message,
        });
    });

    actors.forEach((actor) => {
        townsHash[actor.shantytownId].actors.push(actor);
    });

    actions.forEach((action: ShantytownAction) => {
        action.shantytowns.forEach((shantytownId) => {
            if (townsHash[shantytownId]?.actions === undefined) {
                return;
            }

            townsHash[shantytownId].actions.push(action);
        });
    });

    incomingTowns.forEach((incomingTown) => {
        townsHash[incomingTown.shantytownId].reinstallationIncomingTowns.push(incomingTown);
    });
    /* eslint-enable no-param-reassign */
}
