<template>
    <section>
        <p>Filtrer par</p>
        <DsfrFiltre
            v-if="expertiseTopicsItems.length > 0"
            v-model="expertiseTopicsFilter"
            title="Expertises ou sujets d'intérêts"
            :options="expertiseTopicsItems"
        />
    </section>
</template>

<script setup>
import { computed, toRefs } from "vue";
import { useConfigStore } from "@/stores/config.store";
import { DsfrFiltre } from "@resorptionbidonvilles/ui";

const props = defineProps({
    modelValue: {
        type: Array,
        required: false,
        default() {
            return [];
        },
    },
});
const { modelValue } = toRefs(props);
const emit = defineEmits(["update:modelValue"]);

const configStore = useConfigStore();
const expertiseTopicsItems = computed(() => {
    return (configStore.config?.expertise_topics || []).map((item) => ({
        value: item.uid,
        label: item.label,
    }));
});
const expertiseTopicsFilter = computed({
    get() {
        return modelValue.value;
    },
    set(newValue) {
        emit("update:modelValue", newValue);
    },
});
</script>
