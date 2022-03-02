module.exports = stats => {
    return [
        {
            ...stats.population,
            icon: "male",
            label: "personnes sur",
            label_secondary: "sites",
            figure_secondary: stats.openShantytowns.figures[0],
            color: stats.population.evolution >= 0 ? "red" : "green"
        },
        {
            ...stats.minors,
            icon: "child",
            label: `enfants dont`,
            label_secondary: "scolarisés",
            figure_secondary: stats.minorsInSchool.figures[0],
            color: stats.minors.evolution >= 0 ? "red" : "green"
        },
        {
            ...stats.closedShantytowns,
            icon: "times",
            label: "sites fermés",
            color: stats.closedShantytowns.evolution >= 0 ? "green" : "red"
        },
        {
            ...stats.resorbedShantytowns,
            icon: "check",
            label: "sites résorbés",
            color: stats.resorbedShantytowns.evolution >= 0 ? "green" : "red"
        },
        {
            ...stats.userStats,
            icon: "user",
            label: "utilisateurs",
            color: stats.userStats.evolution >= 0 ? "green" : "red"
        }
    ];
};
