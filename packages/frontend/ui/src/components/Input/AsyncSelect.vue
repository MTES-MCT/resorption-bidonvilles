<template>
    <Select
        v-bind="$attrs"
        :isLoading="isLoading"
        :disabled="isLoading"
    >
        <template v-if="mode === 'grouped'">
            <optgroup v-for="group in options" :key="group.label" :label="group.label">
                <option
                    v-for="option in group.options"
                    :key="option.id"
                    :value="option.id"
                >
                    {{ option.label }}
                </option>
            </optgroup>
        </template>
        
        <template v-else>
            <option
                v-for="option in options"
                :key="option.id"
                :value="option.id"
            >
                {{ option.label }}
            </option>
        </template>
    </Select>
    <p v-if="error" class="text-secondary -mt-5 mb-5 text-right">
        <Icon icon="triangle-exclamation" /> Le chargement des données a échoué,
        <span class="cursor-pointer underline hover:no-underline" @click="load"
            >souhaitez-vous réessayer ?</span
        >
    </p>
</template>

<script setup>
import { computed, onMounted, ref, toRefs, defineProps, defineExpose } from "vue";
import Icon from "../Icon.vue";
import Select from "./Select.vue";

const props = defineProps({
    mode: {
        type: String,
        required: false,
        default: 'regular' // either 'regular' or 'grouped'
    },
    options: {
        type: Array,
        required: false,
        default: () => [],
    },
    loader: {
        type: Function,
        required: true
    }
});

const { options, loader } = toRefs(props);

const error = ref(false);
const isLoading = ref(false);
onMounted(() => {
    if (options.value.length === 0) {
        load();
    }
});

async function load() {
    if (isLoading.value === true) {
        return;
    }

    error.value = false;
    isLoading.value = true;

    try {
        await loader.value();
    } catch (e) {
        error.value = true;
    }

    isLoading.value = false;
}

defineExpose({
    reload: load
});
</script>
