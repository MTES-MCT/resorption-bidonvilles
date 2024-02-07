<template>
    <form>
        <FormParagraph :title="labels.organization_areas" showMandatoryStar>
            <p class="text-info mb-2">
                <Icon icon="info-circle" />
                Le territoire d'intervention de la structure est partagé par
                tous les utilisateurs qui y sont rattachés. Attention donc, si
                vous modifiez ce territoire, vous le modifiez pour
                <span class="font-bold"
                    >tous les utilisateurs de cette structure</span
                >.
            </p>
            <FormMiseAjourTerritoiresInputOrganizationAreas
        /></FormParagraph>

        <FormParagraph
            class="mt-12"
            :title="labels.user_areas"
            info="(optionnel)"
        >
            <p class="text-info mb-2">
                <Icon icon="info-circle" />
                Le territoire d'intervention de l'utilisateur lui est spécifique
                et ne concerne que lui. Il
                <span class="font-bold"
                    >s'ajoute au territoire de sa structure (ci-dessus)</span
                >.
            </p>
            <FormMiseAjourTerritoiresInputUserAreas
        /></FormParagraph>

        <ErrorSummary
            id="erreurs"
            class="mt-12"
            v-if="error || Object.keys(errors).length > 0"
            :message="error"
            :summary="errors"
        />
    </form>
</template>

<script setup>
import { ref, defineExpose, toRefs } from "vue";
import { useForm } from "vee-validate";
import schema from "./FormMiseAjourTerritoires.schema";
import labels from "./FormMiseAjourTerritoires.labels";
import { useNotificationStore } from "@/stores/notification.store";
import { useAccesStore } from "@/stores/acces.store";
import router from "@/helpers/router";
import { setInterventionAreas } from "@/api/users.api";

import { ErrorSummary, FormParagraph, Icon } from "@resorptionbidonvilles/ui";
import FormMiseAjourTerritoiresInputOrganizationAreas from "./inputs/FormMiseAjourTerritoiresInputOrganizationAreas.vue";
import FormMiseAjourTerritoiresInputUserAreas from "./inputs/FormMiseAjourTerritoiresInputUserAreas.vue";

const props = defineProps({
    user: {
        type: Object,
        required: true,
    },
});
const { user } = toRefs(props);

const { handleSubmit, setErrors, errors, isSubmitting } = useForm({
    validationSchema: schema,
    initialValues: user.value.intervention_areas.areas
        .filter(({ is_main_area }) => is_main_area === true)
        .reduce(
            (acc, area) => {
                acc[`${area.area_of}_areas`].push({
                    type: area.type,
                    code: area[area.type]?.code || null,
                    name: area[area.type]?.name || "France entière",
                });
                return acc;
            },
            {
                organization_areas: [],
                user_areas: [],
            }
        ),
});

const error = ref(null);

defineExpose({
    submit: handleSubmit(async (sentValues) => {
        error.value = null;

        try {
            const accesStore = useAccesStore();
            const updatedUser = await setInterventionAreas(user.value.id, {
                organization_areas: sentValues.organization_areas.map(
                    ({ type, code, name }) => ({
                        type,
                        code,
                        name,
                    })
                ),
                user_areas: sentValues.user_areas.map(
                    ({ type, code, name }) => ({
                        type,
                        code,
                        name,
                    })
                ),
            });

            accesStore.updateUser(user.value.id, updatedUser);

            const notificationStore = useNotificationStore();
            notificationStore.success(
                "Territoires modifiés",
                "Le territoire d'intervention a bien été mis à jour, l'effet est immédiat"
            );
            router.replace("/acces");
        } catch (e) {
            error.value = e?.user_message || "Une erreur inconnue est survenue";
            if (e?.fields) {
                setErrors(e.fields);
            }
        }
    }),
    isSubmitting,
});
</script>
