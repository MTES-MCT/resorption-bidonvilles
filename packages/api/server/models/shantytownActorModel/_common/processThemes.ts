import { ActorTheme, ProcessedActorThemes } from '#root/types/resources/ShantytownActor.d';

const accumulateTheme = (acc: ProcessedActorThemes, theme: ActorTheme): ProcessedActorThemes => {
    if (theme.id === 'autre') {
        return {
            ...acc,
            autre: theme.value,
        };
    }

    return {
        ...acc,
        themes: [
            ...acc.themes,
            theme.id,
        ],
    };
};

export default function processThemes(themes: ActorTheme[]): ProcessedActorThemes {
    return themes.reduce((acc, theme) => accumulateTheme(acc, theme), {
        themes: [],
        autre: null,
    });
}
