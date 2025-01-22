<template>
    <section>
        <p>Filtrer par</p>
        <RbFilter
            v-model="expertiseTopicsFilter"
            v-if="expertiseTopicsItems.length > 0"
            title="Expertises ou sujets d'intérêts"
            :options="expertiseTopicsItems"
            class="border-1 !border-primary rounded hover:bg-blue200"
        />
    </section>
</template>

<script setup>
import { computed, toRefs } from "vue";
import { useConfigStore } from "@/stores/config.store";
import { Filter as RbFilter } from "@resorptionbidonvilles/ui";

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
