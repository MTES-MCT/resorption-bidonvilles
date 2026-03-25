<template>
    <LayoutLoading v-if="isLoading !== false" />

    <LayoutError v-else-if="error !== null">
        <template v-slot:title>Formulaire inaccessible</template>
        <template v-slot:code>{{ error }}</template>
        <template v-slot:content
            >Vous souhaitiez compléter les informations d'une action, mais nous
            ne parvenons pas à collecter les informations nécessaires. Vous
            pouvez réessayer un peu plus tard ou nous contacter en cas
            d'urgence.</template
        >
        <template v-slot:actions>
            <Button
                icon="rotate-right"
                iconPosition="left"
                type="button"
                @click="load"
                >Réessayer</Button
            >
            <ButtonContact />
        </template>
    </LayoutError>

    <LayoutForm v-else size="large">
        <template v-slot:icon
            ><img :src="svgSearch" alt="Mise à jour de l'action"
        /></template>
        <template v-slot:title>Mise à jour de l'action</template>
        <template v-slot:subtitle>
            {{ action.name }}
        </template>
        <template v-slot:buttons>
            <DsfrButton secondary @click.prevent.stop="back"
                >Annuler</DsfrButton
            >
            <DsfrButton @click="submit" :loading="form?.isSubmitting"
                >Mettre à jour l'action</DsfrButton
            >
        </template>

        <ContentWrapper size="large">
            <FormDeclarationAction
                ref="form"
                :action="action"
                @submitted-successfully="allowLeaveWithoutConfirmOnce = true"
            />
        </ContentWrapper>

        <div class="visually-hidden" aria-live="polite" aria-atomic="true">
            {{ politeLiveMessage }}
        </div>
        <div class="visually-hidden" aria-live="assertive" aria-atomic="true">
            {{ assertiveLiveMessage }}
        </div>

        <Transition name="floating-update-bar-slide">
            <section
                v-if="!isLoading && hasFormChanged"
                aria-label="Changements non enregistrés"
                class="floating-update-bar bg-yellow-200"
            >
                <div
                    class="floating-update-bar__inner p-4 flex flex-row justify-between"
                >
                    <div class="content-center">
                        Des modifications ont été apportées à l'action, pensez à
                        les enregistrer
                    </div>
                    <div class="flex flex-row gap-3">
                        <DsfrButton secondary @click.prevent.stop="back"
                            >Annuler</DsfrButton
                        >
                        <DsfrButton
                            @click="submit"
                            :loading="form?.isSubmitting"
                            >Mettre à jour l'action</DsfrButton
                        >
                    </div>
                </div>
            </section>
        </Transition>
    </LayoutForm>
</template>

<script setup>
import { onMounted, ref, computed, watch, nextTick } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import { useActionsStore } from "@/stores/actions.store.js";
import router, { setDocumentTitle } from "@/helpers/router";
import backOrReplace from "@/utils/backOrReplace";

import { Button, ContentWrapper } from "@resorptionbidonvilles/ui";
import LayoutError from "@/components/LayoutError/LayoutError.vue";
import LayoutLoading from "@/components/LayoutLoading/LayoutLoading.vue";
import LayoutForm from "@/components/LayoutForm/LayoutForm.vue";
import FormDeclarationAction from "@/components/FormDeclarationAction/FormDeclarationAction.vue";
import ButtonContact from "@/components/ButtonContact/ButtonContact.vue";

import svgSearch from "@/assets/img/dsfr/search.svg";

const actionsStore = useActionsStore();
const isLoading = ref(null);
const error = ref(null);
const action = ref(null);
const form = ref(null);
const politeLiveMessage = ref("");
const assertiveLiveMessage = ref("");
const allowLeaveWithoutConfirmOnce = ref(false);
const hasFormChanged = computed(() => form.value?.hasChanges ?? false);

const FORM_CHANGED_MESSAGE =
    "Des modifications ont été apportées à l'action, pensez à les enregistrer";
const LEAVE_CONFIRM_MESSAGE =
    "Des modifications n'ont pas été enregistrées. Voulez-vous vraiment quitter ?";

onMounted(load);

const actionId = computed(() => {
    return parseInt(router.currentRoute.value.params.id, 10);
});

async function load() {
    if (isLoading.value === true) {
        return;
    }

    isLoading.value = true;
    error.value = null;
    try {
        action.value = (await actionsStore.fetchAction(actionId.value)).value;
        setDocumentTitle(
            `${router.currentRoute.value.meta.title} — ${action.value.name}`
        );
    } catch (e) {
        error.value = e?.code || "Erreur inconnue";
    }

    isLoading.value = false;
}

function submit(...args) {
    return form.value.submit(...args);
}

function back() {
    if (actionId.value) {
        backOrReplace(`/action/${actionId.value}`);
    } else {
        router.back();
    }
}

async function announce(messageRef, message) {
    messageRef.value = "";
    await nextTick();
    messageRef.value = message;
}

watch(hasFormChanged, async (hasChanged, hadChanged) => {
    if (hasChanged && !hadChanged) {
        await announce(politeLiveMessage, FORM_CHANGED_MESSAGE);
    }
});

onBeforeRouteLeave(async () => {
    if (allowLeaveWithoutConfirmOnce.value) {
        allowLeaveWithoutConfirmOnce.value = false;
        return true;
    }

    if (!hasFormChanged.value) {
        return;
    }

    // Annonce pour les lecteurs d'écran que des changements n'ont pas été enregistrés, puis délai pour laisser le temps à l'annonce d'être lue avant d'afficher la boîte de confirmation
    await announce(assertiveLiveMessage, LEAVE_CONFIRM_MESSAGE);
    await new Promise((resolve) => {
        setTimeout(resolve, 150);
    });

    return typeof confirm === "function"
        ? confirm(LEAVE_CONFIRM_MESSAGE)
        : true;
});
</script>

<style scoped>
button {
    border: inherit;
}

.visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}

.floating-update-bar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
    pointer-events: none;
    width: 80%;
    margin-left: auto;
    margin-right: auto;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.floating-update-bar__inner {
    pointer-events: auto;
    max-width: 1280px;
    margin: 0 auto;
}

.floating-update-bar-slide-enter-active,
.floating-update-bar-slide-leave-active {
    transition: transform 0.25s ease, opacity 0.25s ease;
}

.floating-update-bar-slide-enter-from,
.floating-update-bar-slide-leave-to {
    transform: translateY(100%);
    opacity: 0;
}

.floating-update-bar-slide-enter-to,
.floating-update-bar-slide-leave-from {
    transform: translateY(0);
    opacity: 1;
}
</style>
