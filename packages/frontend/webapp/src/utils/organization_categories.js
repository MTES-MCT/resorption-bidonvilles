export default (withOther = false) => {
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

    if (withOther === true) {
        cats.push({ value: "other", label: "Autre" });
    }

    return cats;
};
