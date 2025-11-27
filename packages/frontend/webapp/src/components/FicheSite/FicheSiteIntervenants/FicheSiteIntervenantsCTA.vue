<template>
    <div class="bg-yellow-200 px-4 py-2 flex items-center justify-between">
        <div class="flex items-center">
            <div
                class="rounded-full bg-yellow-400 w-6 h-6 text-center text-size-xs leading-6"
            >
                <Icon icon="flag" />
            </div>
            <p class="ml-4">
                <span class="font-bold">Vous intervenez sur ce site ?</span>
                Faites le savoir à la communauté.<br />
                <span class="text-sm"
                    >Votre intervention mérite d'être signalée même si vous
                    n'accompagnez pas l'ensemble des habitants du site.</span
                >
            </p>
        </div>
        <DsfrButton @click="openSelfThemes"
            >J'interviens sur ce site</DsfrButton
        >
    </div>
</template>

<script setup>
import { useEventBus } from "@common/helpers/event-bus.js";
import { Icon } from "@resorptionbidonvilles/ui";

const { emit } = useEventBus();
function openSelfThemes() {
    emit("fichesite:openSelfThemes");
}
</script>
