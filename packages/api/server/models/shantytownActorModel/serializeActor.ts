
import { ActorRow } from './ActorRow';

type Theme = {
    id: string
} | {
    id: number,
    value: string
} ;

export type Actor = {
    id: number,
    first_name: string,
    last_name: string,
    organization: {
        id: number,
        name: string,
    },
    themes: Theme[],
};
export default (actor: ActorRow):Actor => {
    const themes: Theme[] = [
        ...actor.themes.map(id => ({
            id,
        })),
    ];

    if (actor.autre !== null) {
        themes.push({
            id: 'autre',
            value: actor.autre,
        });
    }

    return {
        id: actor.userId,
        first_name: actor.userFirstName,
        last_name: actor.userLastName,
        organization: {
            id: actor.organizationId,
            name: actor.organizationAbbreviation || actor.organizationName,
        },
        themes,
    };
};
