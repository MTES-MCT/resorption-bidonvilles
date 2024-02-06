export default (options = {}) => {
    const cats = [
        {
            value: "public_establishment",
            label: "Service de l'état, établissement, ou organisme public",
        },
        {
            value: "territorial_collectivity",
            label: "Collectivité territoriale",
        },
        {
            value: "association",
            label: "Association",
        },
        { value: "administration", label: "Administration centrale" },
    ];

    if (options.other === true) {
        cats.push({ value: "other", label: "Autre" });
    }

    if (options.private_organization === true) {
        cats.push({ value: "private_organization", label: "Organisme privé" });
    }

    return cats;
};
