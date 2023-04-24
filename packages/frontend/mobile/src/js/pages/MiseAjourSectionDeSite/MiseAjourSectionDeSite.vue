<template>
    <div class="h-full">
        <Layout v-if="isLoading !== false">
            <template v-slot:header>
                <header>
                    <div
                        class="text-center text-primary text-display-md font-bold mt-16"
                    >
                        <Spinner />
                    </div>
                </header>
            </template>
        </Layout>

        <Layout v-else-if="loadingError !== null">
            <template v-slot:header>
                <header>
                    <p class="text-center text-red text-display-lg mb-4">
                        {{ loadingError }}
                    </p>
                </header>
            </template>
        </Layout>

        <LayoutForm v-else-if="town !== null" :town="town">
            <template v-slot:scroll>
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
                <Button
                    @click="submit"
                    variant="primary"
                    type="button"
                    class="mb-5 ml-5"
                    >Mettre à jour le site</Button
                >
            </template>
        </LayoutForm>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useEventBus } from "#frontend/common/helpers/event-bus";
import { useForm } from "vee-validate";
import store from "#src/store/index.js";
import router from "../../router";
import { editTown } from "../../helpers/town";
import enrichShantytown from "#frontend/common/helpers/town/enrichShantytown";
import isDeepEqual from "@resorptionbidonvilles/ui/src/utils/isDeepEqual";
import schemaFn from "./MiseAjourSectionDeSite.schema";
import formatFormTown from "#frontend/common/utils/formatFormTown";
import formatFormDate from "#frontend/common/utils/formatFormDate";

import { Button, ErrorSummary, Spinner } from "@resorptionbidonvilles/ui";
import Layout from "#src/js/components/Layout.vue";
import LayoutForm from "#src/js/components/LayoutForm.vue";
import FormMiseAJourDeSiteSectionHabitants from "#src/js/components/FormMiseAJourDeSiteSectionHabitants/FormMiseAJourDeSiteSectionHabitants.vue";
import FormMiseAJourDeSiteSectionConditionsDeVie from "#src/js/components/FormMiseAJourDeSiteSectionConditionsDeVie/FormMiseAJourDeSiteSectionConditionsDeVie.vue";

const town = ref(null);
const section = ref(null);
const loadingError = ref(null);
const formError = ref(null);
const isLoading = ref(null);
const initialValues = ref(null);
const validationSchema = ref(null);

onMounted(async () => {
    await load();
    initialValues.value = formatFormTown(town.value);
    validationSchema.value = schemaFn(section.value);
});

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

async function load() {
    if (isLoading.value === true) {
        return;
    }
    isLoading.value = true;
    loadingError.value = null;
    const townId = parseInt(router.currentRoute.value.params.id, 10);
    section.value = router.currentRoute.value.params.section_id;
    if (store.state.towns.state !== "loaded") {
        await store.dispatch("fetchTowns");
    }
    if (store.state.towns.hash[townId]) {
        town.value = store.state.towns.hash[townId];
        isLoading.value = false;
        return;
    }
    try {
        town.value = await store.dispatch("fetchShantytown", townId);
    } catch (err) {
        loadingError.value = "Erreur: " + err.message;
    }
    isLoading.value = false;
}

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
    try {
        const formattedValues = formatValuesForApi({
            ...initialValues.value,
            ...values,
        });
        const originalValues = formatValuesForApi({
            ...initialValues.value,
        });

        if (isDeepEqual(originalValues, formattedValues)) {
            formError.value =
                "Modification impossible : aucun champ n'a été modifié";
            router.replace("#erreurs");
            return;
        }
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
    }
}
</script>
