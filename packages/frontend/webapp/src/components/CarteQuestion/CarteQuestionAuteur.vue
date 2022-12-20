<template>
    <div class="flex items-center customAlign">
        <Icon icon="circle-user" class="text-lg" />
        <div class="font-bold ml-2 whitespace-nowrap">
            {{ auteur.first_name }} {{ auteur.last_name }}
        </div>
    </div>
</template>
<script setup>
import { defineProps, toRefs } from "vue";
import { Icon } from "@resorptionbidonvilles/ui";

const props = defineProps({
    auteur: Object,
});
const { auteur } = toRefs(props);
</script>
