<template>
    <FormMiseAJourDeSiteSectionHabitants
        :town="town"
        v-if="section === 'habitants'"
    />
    <FormMiseAJourDeSiteSectionConditionsDeVie
        :town="town"
        v-else-if="section === 'conditions-de-vie'"
    />
    <ErrorSummary
        id="erreurs"
        v-if="formError || Object.keys(errors).length > 0"
        :message="formError"
        :summary="errors"
    />
    <Button @click="submit" variant="primary" type="button" class="mb-5 ml-5"
        >Mettre à jour le site</Button
    >
</template>

<script setup>
import { ref, toRefs, watch } from "vue";
import { useEventBus } from "#frontend/common/helpers/event-bus";
import { useForm } from "vee-validate";
import store from "#src/store/index.js";
import router from "../../router";
import { editTown } from "../../helpers/town";
import enrichShantytown from "#frontend/common/helpers/town/enrichShantytown";
import isDeepEqual from "@resorptionbidonvilles/ui/src/utils/isDeepEqual";
import formatFormDate from "#frontend/common/utils/formatFormDate";
import schemaFn from "./MiseAjourDeSite.schema";
import formatFormTown from "#frontend/common/utils/formatFormTown";

import { Button, ErrorSummary } from "@resorptionbidonvilles/ui";
import FormMiseAJourDeSiteSectionHabitants from "./FormMiseAJourDeSiteSectionHabitants.vue";
import FormMiseAJourDeSiteSectionConditionsDeVie from "./FormMiseAJourDeSiteSectionConditionsDeVie.vue";

const props = defineProps({
    section: {
        type: String,
        required: true,
    },
    town: {
        type: Object,
        required: true,
    },
});

const { section, town } = toRefs(props);

const validationSchema = schemaFn(section.value);
const initialValues = formatFormTown(town.value);

const formError = ref(null);

const { values, errors, setErrors } = useForm({
    validationSchema,
    initialValues,
});

const { bus } = useEventBus();

watch(
    () => bus.value.get("miseAJourSite:submit"),
    () => {
        submit();
    }
);

function formatValuesForApi(v) {
    let citycode = null;
    let label = null;
    if (v.address?.data) {
        ({ citycode, label } = v.address.data);
    }

    return {
        ...v,
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

async function submit() {
    const formattedValues = formatValuesForApi({
        ...initialValues,
        ...values,
    });
    const originalValues = formatValuesForApi({
        ...initialValues,
    });

    if (isDeepEqual(originalValues, formattedValues)) {
        formError.value =
            "Modification impossible : aucun champ n'a été modifié";
        router.replace("#erreurs");
        return;
    }
    try {
        const respondedTown = await editTown(town.value.id, formattedValues);
        store.dispatch("notifications/add", {
            text: "Le site a bien été mis à jour",
            icon: "paper-plane",
        });
        store.state.towns.hash[town.value.id] = enrichShantytown(
            respondedTown,
            store.state.config.configuration.field_types
        );
        router.push(`/site/${town.value.id}`);
    } catch (error) {
        formError.value =
            error?.user_message || "Une erreur inconnue est survenue";
        if (error?.fields) {
            setErrors(error.fields);
        }
        router.replace("#erreurs");
    }
}
</script>
