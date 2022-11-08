<template>
    <form>
        <Modal :isOpen="isOpen" closeWhenClickOutside @close="close">
            <template v-slot:title>{{ title }}</template>
            <template v-slot:subtitle>
                <FicheSiteModaleSubtitle :town="town" />
            </template>
            <template v-slot:body>
                <template v-if="mode === 'declare'">
                    <ModaleFermetureInputDate />
                    <ModaleFermetureInputClosingReasons />
                    <ModaleFermetureInputClosingContext />
                    <ModaleFermetureInputClosingSolutions />
                    <ModaleFermetureInputClosedWithSolutions
                        :peopleWithSolutions="peopleWithSolutions"
                    />
                </template>

                <template v-else>
                    <p>
                        <span class="font-bold"
                            >Date de fermeture du site :</span
                        >
                        ?
                    </p>
                </template>

                <ErrorSummary
                    class="mt-4"
                    v-if="error || Object.keys(errors).length > 0"
                    :message="error"
                    :summary="errors"
                />
            </template>

            <template v-slot:footer>
                <Button
                    variant="primaryOutline"
                    @click="close"
                    class="mr-2"
                    type="button"
                    >Annuler</Button
                >
                <Button @click="submit" :loading="isSubmitting"
                    >Fermer le site</Button
                >
            </template>
        </Modal>
    </form>
</template>

<script setup>
import { defineProps, toRefs, ref, computed, defineExpose } from "vue";
import { useForm } from "vee-validate";
import { useTownsStore } from "@/stores/towns.store";
import { useNotificationStore } from "@/stores/notification.store";
import { useConfigStore } from "@/stores/config.store";
import { trackEvent } from "@/helpers/matomo";
import schema from "./FicheSiteModaleFermeture.schema";

import { Button, ErrorSummary, Modal } from "@resorptionbidonvilles/ui";
import FicheSiteModaleSubtitle from "../FicheSiteModaleSubtitle/FicheSiteModaleSubtitle.vue";
import ModaleFermetureInputDate from "./inputs/ModaleFermetureInputDate.vue";
import ModaleFermetureInputClosingReasons from "./inputs/ModaleFermetureInputClosingReasons.vue";
import ModaleFermetureInputClosingContext from "./inputs/ModaleFermetureInputClosingContext.vue";
import ModaleFermetureInputClosingSolutions from "./inputs/ModaleFermetureInputClosingSolutions.vue";
import ModaleFermetureInputClosedWithSolutions from "./inputs/ModaleFermetureInputClosedWithSolutions.vue";
import formatDate from "@/utils/formatDate";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);

const { handleSubmit, isSubmitting, setErrors, errors, resetForm, values } =
    useForm({
        validationSchema: schema,
    });
const isOpen = ref(false);
const error = ref(null);
const mode = ref("declare"); // soit "declare" pour une nouvelle fermeture, soit "fix" pour une correction de fermeture
const title = computed(() => {
    if (mode.value === "declare") {
        return "Fermer le site";
    }

    return "Corriger la fermeture du site";
});

const actualSolutionIds = computed(() => {
    const actualSolutions = [
        "Hébergement ou logement adapté longue durée avec accompagnement, dont espace terrain d’insertion",
        "Logement",
    ];

    const configStore = useConfigStore();
    return actualSolutions.map((label) => {
        const s = configStore.config.closing_solutions.find(
            ({ label: l }) => l === label
        );
        return s.id;
    });
});
const peopleWithSolutions = computed(() => {
    if (!town.value.populationTotal) {
        return null;
    }

    let total = actualSolutionIds.value.reduce((acc, solutionId) => {
        return (
            acc +
            (values.closing_solution_details?.[`${solutionId}`]
                ?.peopleAffected || 0)
        );
    }, 0);
    return ((total / town.value.populationTotal) * 100).toFixed(0);
});

const config = {
    declare: {
        async submit(values) {
            throw new Error("test");
        },
        successWording: "",
    },
    fix: {
        async submit(values) {
            throw new Error("test");
        },
        successWording: "",
    },
};

function close() {
    resetForm();
    isOpen.value = false;
}

const submit = handleSubmit(async (values) => {
    const { submit, successWording } = config[mode.value];
    const notificationStore = useNotificationStore();
    error.value = null;

    try {
        await submit(values);
        notificationStore.success("", successWording);
        close();
    } catch (e) {
        error.value = e?.user_message || "Une erreur inconnue est survenue";
        if (e?.fields) {
            setErrors(e.fields);
        }
    }
});

defineExpose({
    open(argMode = "declare") {
        mode.value = argMode;
        isOpen.value = true;
    },
});
</script>
