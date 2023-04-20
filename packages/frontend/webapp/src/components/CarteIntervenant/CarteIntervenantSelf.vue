<template>
    <article class="p-4 flex space-x-2 border border-blue200 bg-blue200">
        <Icon class="mt-1" icon="user" />
        <div class="flex-1">
            <p class="font-bold">
                {{ actor.first_name }} {{ actor.last_name.toUpperCase() }}
            </p>
            <p>{{ actor.organization.name }}</p>
            <div class="mt-2 flex gap-2 flex-wrap items-start">
                <template v-if="actor.themes.length > 0">
                    <CarteIntervenantSelfTag
                        v-for="theme in actor.themes"
                        :key="theme.id"
                        :townId="townId"
                        :theme="theme"
                    />
                </template>
                <ToolTip
                    tip="Cliquez ici pour modifier vos champs d'intervention"
                    @click="openSelfThemes"
                >
                    <Button icon="plus" size="sm" variant="primaryOutline" />
                </ToolTip>
            </div>
            <p class="text-right mt-6">
                <Button
                    type="button"
                    size="sm"
                    variant="primaryOutline"
                    icon="fa-regular fa-trash-alt"
                    iconPosition="left"
                    @click="removeSelf"
                    :loading="isLoading"
                >
                    Signaler que je n'interviens plus sur ce site</Button
                >
            </p>
        </div>
    </article>
</template>

<script setup>
import { toRefs, ref } from "vue";
import { useTownsStore } from "@/stores/towns.store";
import { useNotificationStore } from "@/stores/notification.store";
import { useEventBus } from "@common/helpers/event-bus";
import { Button, Icon, ToolTip } from "@resorptionbidonvilles/ui";
import CarteIntervenantSelfTag from "./CarteIntervenantSelfTag.vue";

const props = defineProps({
    townId: Number,
    actor: Object,
});
const { townId, actor } = toRefs(props);
const isLoading = ref(false);

async function removeSelf() {
    if (isLoading.value === true) {
        return;
    }

    isLoading.value = true;
    const notificationStore = useNotificationStore();

    try {
        const townsStore = useTownsStore();
        await townsStore.removeActor(townId.value, actor.value.id);
        notificationStore.success(
            "Retrait des intervenants",
            "Vous avez bien été retiré(e) de la liste des intervenants"
        );
    } catch (e) {
        notificationStore.error(
            "Retrait des intervenants",
            e?.user_message || "Une erreur inconnue est survenue"
        );
    }

    isLoading.value = false;
}

const { emit } = useEventBus();
function openSelfThemes() {
    emit("fichesite:openSelfThemes");
}
</script>
