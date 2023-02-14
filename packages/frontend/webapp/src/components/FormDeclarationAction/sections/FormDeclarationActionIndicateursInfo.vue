<template>
    <div class="bg-yellow-200 mb-4 px-4 py-2 flex items-center justify-between">
        <div class="flex items-center">
            <div
                class="rounded-full bg-yellow-400 w-6 h-6 text-center text-size-xs leading-6"
            >
                <Icon icon="flag" />
            </div>
            <p class="ml-4">
                <span class="text-sm">
                    Les indicateurs concernent le bilan de l'année. Exemple : le
                    nombre de personnes ayant eu un contrat au cours de l'année
                    même si certaines personnes ne sont plus en contrat au 31
                    décembre de l'année.
                </span>
            </p>
        </div>
    </div>
</template>
<script setup>
import { Icon } from "@resorptionbidonvilles/ui";
</script>
