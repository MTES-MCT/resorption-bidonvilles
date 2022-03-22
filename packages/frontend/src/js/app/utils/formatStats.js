module.exports = stats => {
    return [
        {
            ...stats.population,
            id: "population",
            icon: "male",
            label: "personnes ",
            label_secondary: "sur",
            label_tertiary: "sites",
            figure_secondary: stats.openShantytowns.figures.slice(-1)[0],
            color: stats.population.evolution >= 0 ? "red" : "green"
        },
        {
            ...stats.minors,
            id: "children",
            icon: "child",
            label: `enfants`,
            label_secondary: "dont",
            label_tertiary: "scolarisés",
            figure_secondary: stats.minorsInSchool.figures.slice(-1)[0],
            color: stats.minors.evolution >= 0 ? "red" : "green"
        },
        {
            ...stats.resorbedShantytowns,
            id: "resorbed",
            icon: "check",
            label: "résorptions déclarées",
            color: stats.resorbedShantytowns.evolution >= 0 ? "green" : "red"
        },
        {
            ...stats.closedShantytowns,
            id: "closed",
            icon: "ban",
            label: "fermetures",
            color: stats.closedShantytowns.evolution >= 0 ? "green" : "red"
        },

        {
            ...stats.userStats,
            id: "users",
            icon: "user",
            label: "utilisateurs",
            color: stats.userStats.evolution >= 0 ? "green" : "red"
        }
    ];
};
