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
            { value: "shantytowns", label: "Sur Site" },
            { value: "location", label: "Sur terrain d'insertion" },
            {
                value: "housing",
                label: "Dans le logement",
            },
            {
                value: "other",
                label: "Dans plusieurs lieux(hébergement, permanence, rue)",
            },
        ],
    },
];
