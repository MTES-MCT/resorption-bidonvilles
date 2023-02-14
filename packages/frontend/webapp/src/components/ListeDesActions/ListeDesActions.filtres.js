import { useConfigStore } from "@/stores/config.store";
const configStore = useConfigStore();

export default [
    {
        label: "Champs d'intervention",
        id: "topic",
        options: configStore.config.topics.map(({ uid, name }) => ({
            value: uid,
            label: name,
        })),
    },
    {
        label: "Lieu d'intervention",
        id: "interventionLocation",
        options: [
            { value: "sur_site", label: "Sur site" },
            { value: "eti", label: "Sur espace temporaire d'accompagnement" },
            {
                value: "logement",
                label: "Dans le logement",
            },
            {
                value: "autre",
                label: "Autres (hébergement, permanence, rue)",
            },
        ],
    },
];
