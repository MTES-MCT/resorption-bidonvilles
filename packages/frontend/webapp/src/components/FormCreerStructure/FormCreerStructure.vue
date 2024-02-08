<template>
    <form>
        <FormParagraph :title="labels.name" showMandatoryStar>
            <FormCreerStructureInputName :question="question" />
        </FormParagraph>
        <FormParagraph :title="labels.abbreviation" info="(si applicable)">
            <FormCreerStructureInputAbbreviation
        /></FormParagraph>
        <FormParagraph :title="labels.type" showMandatoryStar>
            <FormCreerStructureInputType
        /></FormParagraph>

        <div v-if="showNewtype" class="my-6 bg-G200 p-6 ml-12">
            <h3 class="text-3xl font-bold border-primary text-primary">
                <Icon icon="building" /> Nouveau type de structure
            </h3>
            <div>
                <FormParagraph
                    :title="labels.new_type_category"
                    showMandatoryStar
                >
                    <FormCreerStructureInputNewTypeCategory />
                </FormParagraph>
                <FormParagraph
                    :title="labels.new_type_default_role"
                    showMandatoryStar
                >
                    <FormCreerStructureInputNewTypeDefaultRole />
                </FormParagraph>
                <FormParagraph :title="labels.new_type_name" showMandatoryStar>
                    <FormCreerStructureInputNewTypeName />
                </FormParagraph>
                <FormParagraph
                    :title="labels.new_type_abbreviation"
                    info="(si applicable)"
                >
                    <FormCreerStructureInputNewTypeAbbreviation />
                </FormParagraph>
            </div>
        </div>

        <FormParagraph :title="labels.intervention_areas" showMandatoryStar>
            <FormCreerStructureInputInterventionAreas
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
import { ref, defineExpose, computed } from "vue";
import { useForm, useFieldValue } from "vee-validate";
import schema from "./FormCreerStructure.schema";
import labels from "./FormCreerStructure.labels";
import { useNotificationStore } from "@/stores/notification.store";
import router from "@/helpers/router";
import { create } from "@/api/organizations.api";

import { ErrorSummary, FormParagraph, Icon } from "@resorptionbidonvilles/ui";
import FormCreerStructureInputName from "./inputs/FormCreerStructureInputName.vue";
import FormCreerStructureInputAbbreviation from "./inputs/FormCreerStructureInputAbbreviation.vue";
import FormCreerStructureInputType from "./inputs/FormCreerStructureInputType.vue";
import FormCreerStructureInputNewTypeCategory from "./inputs/FormCreerStructureInputNewTypeCategory.vue";
import FormCreerStructureInputNewTypeName from "./inputs/FormCreerStructureInputNewTypeName.vue";
import FormCreerStructureInputNewTypeAbbreviation from "./inputs/FormCreerStructureInputNewTypeAbbreviation.vue";
import FormCreerStructureInputNewTypeDefaultRole from "./inputs/FormCreerStructureInputNewTypeDefaultRole.vue";
import FormCreerStructureInputInterventionAreas from "./inputs/FormCreerStructureInputInterventionAreas.vue";

const { handleSubmit, setErrors, errors, isSubmitting } = useForm({
    validationSchema: schema,
    initialValues: {
        name: "",
        abbreviation: "",
        type: "",
        new_type_category: null,
        new_type_name: "",
        new_type_abbreviation: "",
        new_type_default_role: "",
        intervention_areas: [],
    },
});
const type = useFieldValue("type");
const showNewtype = computed(() => type.value === "new");

const error = ref(null);

defineExpose({
    submit: handleSubmit(async (sentValues) => {
        error.value = null;

        try {
            await create({
                name: sentValues.name,
                abbreviation: sentValues.abbreviation,
                type:
                    sentValues.type === "new"
                        ? "new"
                        : parseInt(sentValues.type, 10),
                new_type_category:
                    sentValues.type === "new"
                        ? sentValues.new_type_category
                        : null,
                new_type_name:
                    sentValues.type === "new" ? sentValues.new_type_name : null,
                new_type_abbreviation:
                    sentValues.type === "new"
                        ? sentValues.new_type_abbreviation
                        : null,
                new_type_default_role:
                    sentValues.type === "new"
                        ? sentValues.new_type_default_role
                        : null,
                intervention_areas: sentValues.intervention_areas.map(
                    ({ type, code }) => ({
                        type,
                        code,
                    })
                ),
            });
            const notificationStore = useNotificationStore();
            notificationStore.success(
                "Structure créée",
                "La structure a bien été créée, vous pouvez désormais créer des utilisateurs pour cette structure."
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
