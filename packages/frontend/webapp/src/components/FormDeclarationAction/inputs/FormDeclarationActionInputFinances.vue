<template>
    <InputActionFinances
        name="finances"
        :label="labels.finances"
        :minYear="minYear"
        :maxYear="maxYear"
    >
        <template v-slot:info
            >Vous pouvez naviguer d'une année à l'autre en cliquant sur les
            flèches de part et d'autres du tableau.</template
        >
    </InputActionFinances>
</template>

<script setup>
import { computed } from "vue";
import { useFieldValue } from "vee-validate";
import InputActionFinances from "@/components/InputActionFinances/InputActionFinances.vue";
import labels from "../FormDeclarationAction.labels";

const startedAt = useFieldValue("started_at");
const endedAt = useFieldValue("ended_at");

const minYear = computed(() => {
    return startedAt.value ? startedAt.value.getFullYear() : undefined;
});
const maxYear = computed(() => {
    return endedAt.value ? endedAt.value.getFullYear() : undefined;
});
</script>
