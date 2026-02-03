<template>
    <IndicateursTableRow v-bind="$attrs">
        <template v-slot:label><slot /></template>
        <template v-slot:left>
            <div class="grid grid-cols-1">
                <p
                    v-for="(input, index) in inputs"
                    :key="input.id"
                    class="flex items-center h-8 bg-G200"
                    :class="{
                        'px-4':
                            input.tableLabel !== '' &&
                            input.tableLabel !== undefined,
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
                    <TextInputUi
                        v-bind="input"
                        v-model="data[input.id]"
                        withoutMargin
                        variant="minimal"
                        size="sm"
                        :inlineError="true"
                        :errors="errors[input.id] || []"
                        class="!max-h-[2em] !mt-0"
                    />
                </p>
            </div>
        </template>
    </IndicateursTableRow>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import { TextInputUi } from "@resorptionbidonvilles/ui";
import IndicateursTableRow from "./IndicateursTableRow.vue";

const props = defineProps({
    data: {
        type: Object,
        required: true,
    },
    inputs: {
        type: Array,
        required: true,
    },
    errors: {
        type: Object,
        required: false,
        default() {
            return {};
        },
    },
});
const { data, inputs, errors } = toRefs(props);
</script>
