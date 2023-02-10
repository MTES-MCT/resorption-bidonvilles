<template>
    <IndicateursTableRow v-bind="$attrs">
        <template v-slot:label><slot /></template>
        <template v-slot:left>
            <div class="grid grid-cols-1">
                <p
                    v-for="(input, index) in inputs"
                    :key="input.name"
                    class="flex items-center px-4 h-8 bg-G200"
                    :class="{
                        'border-b border-b-G400': index < inputs.length - 1,
                    }"
                >
                    {{ input.tableLabel }}
                </p>
            </div>
        </template>

        <template v-slot:right>
            <div class="grid grid-cols-1 flex-1 self-center">
                <p
                    v-for="(input, index) in inputs"
                    :key="input.name"
                    class="flex items-center px-4 h-8 bg-G200"
                    :class="{
                        'border-b border-b-G400': index < inputs.length - 1,
                    }"
                >
                    <TextInput
                        v-bind="input"
                        withoutMargin
                        variant="minimal"
                        size="sm"
                    />
                </p>
            </div>
        </template>
    </IndicateursTableRow>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import { TextInput } from "@resorptionbidonvilles/ui";
import IndicateursTableRow from "./IndicateursTableRow.vue";

const props = defineProps({
    inputs: {
        type: Array,
        required: true,
    },
});
const { inputs } = toRefs(props);
</script>
