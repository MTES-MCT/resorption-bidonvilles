<template>
    <div class="grid grid-cols-2 gap-4">
        <CarteActionDeSite
            v-for="action in actions"
            :key="action.id"
            :action="action"
        />
    </div>
</template>

<script setup>
import { toRefs } from "vue";
import CarteActionDeSite from "@/components/CarteActionDeSite/CarteActionDeSite.vue";

const props = defineProps({
    actions: {
        type: Array,
        required: true,
    },
});
const { actions } = toRefs(props);
</script>
