export default (options = {}) => {
    const cats = [
        {
            value: "public_establishment",
            label: "Service déconcentré de l'État, établissement ou organisme public",
        },
        { value: "administration", label: "Administration centrale" },
        {
            value: "territorial_collectivity",
            label: "Collectivité territoriale",
        },
        {
            value: "association",
            label: "Association",
        },
    ];

    if (options.private_organization === true) {
        cats.push({
            value: "private_organization",
            label: "Organisme privé autre qu'associatif",
        });
    }

    if (options.other === true) {
        cats.push({ value: "other", label: "Autre" });
    }

    return cats;
};
