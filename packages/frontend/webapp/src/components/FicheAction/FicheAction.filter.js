export default {
    categories: [
        { value: "caracteristiques", label: "Intervention" },
        { value: "localisation", label: "Lieu" },
        { value: "contacts", label: "Contacts" },
        { value: "financements", label: "Financements" },
        { value: "indicateurs", label: "Indicateurs" },
    ],
    fields: {
        caracteristiques: ["name", "started_at", "ended_at", "goals", "topics"],
        localisation: [
            "location.departement.name",
            "location_type",
            "eti.address",
            "eti.latitude",
            "eti.longitude",
            "location_eti_addresses",
            "location_other",
            "location_shantytowns",
        ],
        contacts: ["managers", "operators"],
        financements: ["finances"],
        indicateurs: ["metrics"],
    },
};
