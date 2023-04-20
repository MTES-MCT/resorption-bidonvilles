<template>
    <form>
        <Modal :isOpen="isOpen" closeWhenClickOutside @close="close">
            <template v-slot:title>{{ title }}</template>
            <template v-slot:subtitle>
                <FicheSiteModaleSubtitle :town="town" />
            </template>
            <template v-slot:body>
                <ModaleMesThemesInputThemes />
                <ModaleMesThemesInputOtherTheme />

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
                <Button @click="submit" :loading="isSubmitting">Valider</Button>
            </template>
        </Modal>
    </form>
</template>

<script setup>
import { toRefs, ref, computed } from "vue";
import { useForm } from "vee-validate";
import { useUserStore } from "@/stores/user.store";
import { useTownsStore } from "@/stores/towns.store";
import { useNotificationStore } from "@/stores/notification.store";
import { trackEvent } from "@/helpers/matomo";
import schema from "./FicheSiteModaleMesThemes.schema";

import { Button, ErrorSummary, Modal } from "@resorptionbidonvilles/ui";
import FicheSiteModaleSubtitle from "../FicheSiteModaleSubtitle/FicheSiteModaleSubtitle.vue";
import ModaleMesThemesInputThemes from "./inputs/ModaleMesThemesInputThemes.vue";
import ModaleMesThemesInputOtherTheme from "./inputs/ModaleMesThemesInputOtherTheme.vue";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);
const userStore = useUserStore();

const isOpen = ref(false);
const error = ref(null);
const customTitle = ref(null);
const title = computed(() => {
    if (customTitle.value !== null) {
        return customTitle.value;
    }

    return "J'interviens sur ce site";
});

const config = {
    add: {
        async submit(themes) {
            const townsStore = useTownsStore();
            await townsStore.addActor(town.value.id, userStore.id, themes);

            trackEvent(
                "Intervenant",
                "Déclaration intervenant",
                `S${town.value.id}`
            );
        },
        successWording: "Vous avez été rajouté à la liste des intervenants",
    },
    update: {
        submit(themes) {
            const townsStore = useTownsStore();
            return townsStore.updateActor(town.value.id, userStore.id, themes);
        },
        successWording: "Vos champs d'intervention ont bien été modifiés",
    },
};

const self = computed(() => {
    return town.value.actors.find(({ id }) => id === userStore.id);
});
const defaultValues = computed(() => {
    return {
        themes:
            self.value?.themes
                .map(({ id }) => id)
                .filter((id) => id !== "autre") || [],
        other: self.value?.themes.find(({ id }) => id === "autre")?.value || "",
    };
});
const currentConfig = computed(() => {
    return config[self.value ? "update" : "add"];
});

const { handleSubmit, isSubmitting, setErrors, errors } = useForm({
    validationSchema: schema,
    initialValues: defaultValues.value,
});

function close() {
    customTitle.value = null;
    isOpen.value = false;
}

const submit = handleSubmit(async (values) => {
    error.value = null;

    try {
        const { successWording } = currentConfig.value;
        await dispatch(values);

        const notificationStore = useNotificationStore();
        notificationStore.success(
            "Votre intervention est déclarée",
            successWording
        );
        close();
    } catch (e) {
        error.value = e?.user_message || "Une erreur inconnue est survenue";
        if (e?.fields) {
            setErrors(e.fields);
        }
    }
});

function dispatch(values) {
    const themes = values.themes.map((id) => ({ id }));
    if (values.other !== "") {
        themes.push({ id: "autre", value: values.other });
    }

    return currentConfig.value.submit(themes);
}

defineExpose({
    open(argTitle) {
        customTitle.value = argTitle || null;
        isOpen.value = true;
    },
});
</script>
