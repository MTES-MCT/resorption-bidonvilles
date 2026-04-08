export default {
    categories: [
        { value: "caracteristiques", label: "Intervention" },
        { value: "localisation", label: "Lieu" },
        { value: "contacts", label: "Contacts" },
        { value: "financements", label: "Financements" },
        { value: "indicateurs", label: "Indicateurs" },
        { value: "sites", label: "Sites concernés" },
        { value: "thematiques", label: "Thématiques" },
    ],
    fields: {
        caracteristiques: ["name", "started_at", "ended_at", "goals"],
        localisation: [
            "location.departement.name",
            "location_type",
            "eti.address",
            "eti.latitude",
            "eti.longitude",
            "location_eti_addresses",
            "location_other",
        ],
        contacts: ["managers", "operators"],
        financements: ["finances"],
        indicateurs: ["metrics", "indicateurs"],
        sites: ["location_shantytowns"],
        thematiques: ["topics"],
    },
};
