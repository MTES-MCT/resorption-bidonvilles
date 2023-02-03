<template>
    <ArrangementLeftMenu :tabs="tabs" autonav>
        <template v-slot:menuTitle>Rubriques</template>

        <FormDeclarationDeSiteInfo v-if="town === null" />
        <FormDeclarationDeSiteDateDeMaj
            v-else-if="canSetUpdatedAt"
            :minDate="minUpdatedAt"
        />
        <FormDeclarationDeSiteAdresse :townId="town?.id" class="mt-6" />
        <FormDeclarationDeSiteCaracteristiques class="mt-6" />
        <FormDeclarationDeSiteHabitants
            :location="location"
            :townId="town?.id"
            class="mt-6"
        />
        <FormDeclarationDeSiteConditionsDeVie
            :version="town ? town.livingConditions.version : 2"
            class="mt-6"
        />
        <FormDeclarationDeSiteConditionsDeVieV1
            v-if="values.show_old_living_conditions"
            :town="town"
            class="mt-6"
        />
        <FormDeclarationDeSiteProcedureJudiciaire
            class="mt-6"
            v-if="hasJusticePermission"
            :permissionsToAccessJustice="permissionsToAccessJustice"
            :isLocationDefined="isLocationDefined"
            :mode="mode"
        />

        <ErrorSummary
            id="erreurs"
            class="mt-12"
            v-if="error || Object.keys(errors).length > 0"
            :message="error"
            :summary="errors"
        />
    </ArrangementLeftMenu>
</template>

<script setup>
import {
    computed,
    defineExpose,
    defineProps,
    onMounted,
    ref,
    toRef,
    toRefs,
    watch,
} from "vue";
import { useForm } from "vee-validate";
import { useUserStore } from "@/stores/user.store";
import { useTownsStore } from "@/stores/towns.store";
import { useNotificationStore } from "@/stores/notification.store";
import * as locationsApi from "@/api/locations.api";
import { trackEvent } from "@/helpers/matomo";
import router from "@/helpers/router";
import isDeepEqual from "@/utils/isDeepEqual";
import backOrReplace from "@/utils/backOrReplace";
import formatFormTown from "@/utils/formatFormTown";
import formatFormDate from "@/utils/formatFormDate";

import { ErrorSummary } from "@resorptionbidonvilles/ui";
import ArrangementLeftMenu from "@/components/ArrangementLeftMenu/ArrangementLeftMenu.vue";
import FormDeclarationDeSiteInfo from "./sections/FormDeclarationDeSiteInfo.vue";
import FormDeclarationDeSiteDateDeMaj from "./sections/FormDeclarationDeSiteDateDeMaj.vue";
import FormDeclarationDeSiteAdresse from "./sections/FormDeclarationDeSiteAdresse.vue";
import FormDeclarationDeSiteCaracteristiques from "./sections/FormDeclarationDeSiteCaracteristiques.vue";
import FormDeclarationDeSiteHabitants from "./sections/FormDeclarationDeSiteHabitants.vue";
import FormDeclarationDeSiteConditionsDeVie from "./sections/FormDeclarationDeSiteConditionsDeVie.vue";
import FormDeclarationDeSiteConditionsDeVieV1 from "./sections/FormDeclarationDeSiteConditionsDeVieV1.vue";
import FormDeclarationDeSiteProcedureJudiciaire from "./sections/FormDeclarationDeSiteProcedureJudiciaire.vue";
import schemaFn from "./FormDeclarationDeSite.schema";

import { fetchAll } from "@/api/permissions.api";

const props = defineProps({
    town: {
        type: Object,
        required: false,
        default: null,
    },
});
const { town } = toRefs(props);
const initialValues = {
    update_to_date: 1,
    living_conditions_version: town.value?.livingConditions?.version || 2,
    show_old_living_conditions: false,
    ...formatFormTown(town.value || {}),
};

const mode = computed(() => {
    return town.value === null ? "create" : "edit";
});
const canSetUpdatedAt = computed(() => {
    if (!town.value) {
        return false;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const updatedAt = new Date(town.value.updatedAt * 1000);
    updatedAt.setHours(0, 0, 0, 0);

    return updatedAt < yesterday;
});
const minUpdatedAt = computed(() => {
    if (!town.value) {
        return null;
    }

    const updatedAt = new Date(town.value.updatedAt * 1000);
    updatedAt.setHours(0, 0, 0, 0);
    updatedAt.setDate(updatedAt.getDate() + 1);

    return updatedAt;
});
const validationSchema = schemaFn(mode.value);
const { handleSubmit, values, errors, setErrors } = useForm({
    validationSchema,
    initialValues,
});

const originalValues = formatValuesForApi(values);
const townsStore = useTownsStore();
const userStore = useUserStore();
const error = ref(null);
const location = ref(town.value ? initialValues.location : null);
const address = toRef(values, "address");
const loadedPermissionsToAccessJustice = ref(null);
let isLocationDefined = ref(town.value ? true : false);

onMounted(load);

async function load() {
    const locationInfo = town.value
        ? {
              type: "city",
              ...initialValues.location,
          }
        : null;
    loadPermissionsToAccessJustice(locationInfo);
}

async function loadPermissionsToAccessJustice(location) {
    try {
        loadedPermissionsToAccessJustice.value = await fetchAll(location);
    } catch (e) {
        // Do nothing
    }
}

watch(address, async () => {
    location.value = null;

    if (address.value?.data?.citycode) {
        try {
            location.value = await locationsApi.get(
                "city",
                address.value.data.citycode
            );
        } catch (e) {
            console.log("Failed fetching more information about the city");
        }
    }
});

watch(location, async () => {
    if (location.value?.type) {
        isLocationDefined.value = true;
        try {
            await loadPermissionsToAccessJustice(location.value);
        } catch (error) {
            // Do nothing
        }
    } else {
        isLocationDefined.value = false;
    }
});

const permissionsToAccessJustice = computed(() => {
    let usersWithPermissionsToAccessJustice = [];
    if (loadedPermissionsToAccessJustice.value) {
        usersWithPermissionsToAccessJustice =
            loadedPermissionsToAccessJustice.value.reduce((argAcc, org) => {
                const acc = { ...argAcc };
                if (!acc[org.id]) {
                    let computedLocation = {};
                    if (org.location_type === "nation") {
                        computedLocation = {
                            label: "nation",
                            type: "",
                            name: "National",
                            code: null,
                        };
                    } else if (["region"].includes(org.location_type)) {
                        computedLocation = {
                            label: "Région",
                            type: "region",
                            name: org.region_name,
                            code: org.region_code,
                        };
                    } else if (["departement"].includes(org.location_type)) {
                        computedLocation = {
                            label: "Département",
                            type: "departement",
                            name: org.departement_name,
                            code: org.departement_code,
                        };
                    } else if (["epci"].includes(org.location_type)) {
                        computedLocation = {
                            label: "Intercommunalité",
                            type: "epci",
                            name: org.epci_name,
                            code: org.epci_code,
                        };
                    } else if (["city"].includes(org.location_type)) {
                        computedLocation = {
                            label: "Commune",
                            type: "city",
                            name: org.city_name,
                            code: org.city_code,
                        };
                    } else {
                        computedLocation = {
                            name: location.value.name,
                            code: null,
                        };
                    }
                    acc[org.id] = {
                        id: org.id,
                        name: org.name,
                        abbreviation: org.abbreviation,
                        type: {
                            category: org.type_category,
                            name: org.type_name,
                        },
                        location_name: computedLocation.name,
                        location: computedLocation,
                        users: [org],
                    };
                } else {
                    acc[org.id].users.push(org);
                }
                return acc;
            }, {});
    }
    return usersWithPermissionsToAccessJustice;
});

const hasJusticePermission = computed(() => {
    return userStore.hasLocalizedPermission("shantytown_justice.access", {
        id: town.value?.id || null,
        ...location.value,
    });
});

const tabs = computed(() => {
    const arr = [
        {
            id: "adresse",
            label: "Localisation",
            route: "#adresse",
        },
        {
            id: "caracteristiques",
            label: "Caractéristiques du site",
            route: "#caracteristiques",
        },
        {
            id: "habitants",
            label: "Habitants",
            route: "#habitants",
        },
        {
            id: "conditions_de_vie",
            label: "Conditions de vie et environnement",
            route: "#conditions_de_vie",
        },
    ];

    if (values.show_old_living_conditions === true) {
        arr.push({
            id: "anciennes_conditions_de_vie",
            label: "Anciennes conditions de vie",
            route: "#anciennes_conditions_de_vie",
        });
    }

    if (hasJusticePermission.value) {
        arr.push({
            id: "justice",
            label: "Procédure judiciaire",
            route: "#justice",
        });
    }

    return arr;
});

const config = {
    create: {
        async submit(values) {
            const town = await townsStore.create(values);
            trackEvent("Site", "Création site", `S${town.id}`);
            return town;
        },
        notification: {
            title: "Déclaration réussie",
            content:
                "Le site a été déclaré, et les acteurs concernés ont été prévenus par mail",
        },
    },
    edit: {
        async submit(values, id) {
            const town = await townsStore.edit(id, values);
            trackEvent("Site", "Mise à jour site", `S${id}`);
            return town;
        },
        notification: {
            title: "Mise à jour réussie",
            content: "Le site a bien été mis à jour",
        },
    },
};

function formatValuesForApi(v) {
    let citycode = null;
    let label = null;
    if (v.address?.data) {
        ({ citycode, label } = v.address.data);
    }

    return {
        ...Object.keys(validationSchema.fields).reduce((acc, key) => {
            acc[key] = v[key];
            return acc;
        }, {}),
        ...{
            living_conditions_version: v.living_conditions_version || 2,
            built_at: formatFormDate(v.built_at),
            declared_at: formatFormDate(v.declared_at),
            updated_at: v.updated_at || new Date(),
            census_conducted_at: formatFormDate(v.census_conducted_at),
            justice_rendered_at: formatFormDate(v.justice_rendered_at),
            police_requested_at: formatFormDate(v.police_requested_at),
            police_granted_at: formatFormDate(v.police_granted_at),
            census_status: v.census_status === "null" ? null : v.census_status,
            police_status: v.police_status === "null" ? null : v.police_status,
            citycode,
            address: label,
            coordinates: `${v.coordinates[0]},${v.coordinates[1]}`,
        },
    };
}

defineExpose({
    submit: handleSubmit(async (sentValues) => {
        const formattedValues = formatValuesForApi(sentValues);

        /* eslint-disable no-unused-vars */
        let {
            updated_at: _1,
            update_to_date: _2,
            ...originalValuesRest
        } = originalValues;
        let {
            updated_at: _3,
            update_to_date: _4,
            ...formattedValuesRest
        } = formattedValues;
        /* eslint-enable no-unused-vars */

        if (
            mode.value === "edit" &&
            isDeepEqual(originalValuesRest, formattedValuesRest)
        ) {
            router.replace("#erreurs");
            error.value =
                "Modification impossible : aucun champ n'a été modifié";
            return;
        }

        error.value = null;

        try {
            const notificationStore = useNotificationStore();

            const { submit, notification } = config[mode.value];
            const respondedTown = await submit(formattedValues, town.value?.id);

            notificationStore.success(notification.title, notification.content);
            backOrReplace(`/site/${respondedTown.id}`);
        } catch (e) {
            error.value = e?.user_message || "Une erreur inconnue est survenue";
            if (e?.fields) {
                setErrors(e.fields);
            }
        }
    }),
});
</script>
