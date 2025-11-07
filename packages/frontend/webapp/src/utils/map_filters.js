import { computed } from "vue";
import { useConfigStore } from "@/stores/config.store";

export default computed(() => {
    const configStore = useConfigStore();
    console.log("Config Store:", configStore.config);

    return {
        order: [
            "waterAccessConditions",
            "fieldType",
            "population",
            "status",
            "ownerType",
            "poi",
        ],
        definition: {
            waterAccessConditions: {
                icon: "tint",
                label: "Accès à l'eau",
                options: [
                    {
                        value: "good",
                        label: "Oui",
                        checked: true,
                        icon: { id: "tint", color: "00a0e3" },
                    },
                    {
                        value: "toImprove",
                        label: "À améliorer",
                        checked: true,
                        icon: { id: "tint", color: "ff6f4c" },
                    },
                    {
                        value: "bad",
                        label: "Non",
                        checked: true,
                        icon: { id: "tint-slash", color: "ADB9C9" },
                    },
                    {
                        value: "unknown",
                        label: "Inconnu",
                        checked: true,
                        icon: { id: "question", color: "ADB9C9" },
                    },
                ],
                opened: true,
            },
            fieldType: {
                icon: "tent",
                label: "Type de site",
                options: (configStore.config?.field_types || []).map(
                    (fieldType) => ({
                        id: fieldType.id,
                        value: fieldType.id,
                        label: fieldType.label,
                        checked: true,
                        icon: {
                            id: "square",
                            color: fieldType.color.slice(1),
                        },
                    })
                ),
                opened: true,
            },
            population: {
                icon: "users",
                label: "Nombre de personnes",
                options: [
                    { value: null, label: "Inconnu", checked: true },
                    {
                        value: "-9",
                        label: "Moins de 10 personnes",
                        checked: true,
                    },
                    {
                        value: "10-99",
                        label: "Entre 10 et 99 personnes",
                        checked: true,
                    },
                    {
                        value: "100-",
                        label: "100 personnes et plus",
                        checked: true,
                    },
                ],
            },
            status: {
                icon: "ban",
                label: "Statut des sites",
                options: [
                    { value: "closed", label: "Fermés", checked: false },
                    { value: "open", label: "Existants", checked: true },
                ],
            },
            ownerType: {
                icon: "users",
                label: "Type de propriétaire",
                options: (configStore.config?.owner_types || []).map(
                    (type) => ({
                        value: type.id,
                        label: type.label,
                        checked: true,
                    })
                ),
            },
            poi: {
                icon: "map-marker-alt",
                label: "Points d'intérêts",
                options: [
                    {
                        value: "food_bank",
                        label: "Distribution alimentaire",
                        checked: true,
                    },
                ],
                opened: true,
            },
        },
    };
});
