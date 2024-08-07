export default {
    activityType: {
        label: "Type d'activités",
        id: "activityType",
        options: [
            {
                label: "Nouveaux sites",
                value: "shantytownCreation",
            },
            {
                label: "Fermetures de sites",
                value: "shantytownClosing",
            },
            {
                label: "Modifications de sites",
                value: "shantytownUpdate",
            },
            {
                label: "Nouveaux messages site",
                value: "shantytownComment",
            },
            {
                label: "Nouveaux messages action",
                value: "actionComment",
            },
            {
                label: "Nouveaux utilisateurs",
                value: "user",
            },
            {
                label: "Nouvelles questions",
                value: "question",
            },
            {
                label: "Nouvelles réponses",
                value: "answer",
            },
        ],
    },
    resorbed: {
        label: "Sites résorbés",
        id: "resorbed",
        options: [
            { value: "yes", label: "Oui" },
            { value: "no", label: "Non" },
        ],
    },
    myTowns: {
        label: "Sites sur lesquels j'interviens",
        id: "myTowns",
        options: [
            { value: "yes", label: "Oui" },
            { value: "no", label: "Non" },
        ],
    },
};
