<template>
    <IndicateursTableRow v-bind="$attrs">
        <template v-slot:label><slot /></template>
        <template v-slot:left>
            <div class="grid grid-cols-1">
                <p
                    v-for="(label, index) in labels"
                    :key="`label-${index}`"
                    class="flex items-center min-h-20"
                    :class="[
                        label !== '' && label !== undefined ? 'px-4' : null,
                        index < labels.length - 1
                            ? 'border-b border-b-G400'
                            : null,
                        hasBackground(index) ? 'bg-G200' : 'bg-transparent',
                    ]"
                    v-html="label"
                />
            </div>
        </template>

        <template v-slot:right>
            <div class="grid grid-cols-1 flex-1">
                <p
                    v-for="(field, index) in fields"
                    :key="`field-${index}`"
                    class="flex items-center px-4 min-h-20 bg-G200"
                    :class="{
                        'border-b border-b-G400': index < fields.length - 1,
                    }"
                >
                    <template v-if="field">
                        <TextInputUi
                            :name="field"
                            v-model="data[field]"
                            withoutMargin
                            variant="minimal"
                            size="sm"
                            :inlineError="true"
                            :errors="errors[field] || []"
                        />
                    </template>
                    <template v-else>
                        <div
                            class="w-full h-full flex items-center justify-start"
                        >
                            <span class="font-medium">
                                {{ displayValue(index) }}
                            </span>
                        </div>
                    </template>
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
    labels: {
        type: Array,
        required: true,
    },
    fields: {
        type: Array,
        required: true,
    },
    data: {
        type: Object,
        required: true,
    },
    errors: {
        type: Object,
        default: () => ({}),
    },
    labelsWithoutBackground: {
        type: Array,
        default: () => [],
    },
    readonlyValues: {
        type: Array,
        default: () => [],
    },
});

const {
    labels,
    fields,
    data,
    errors,
    labelsWithoutBackground,
    readonlyValues,
} = toRefs(props);

const hasBackground = (index) => !labelsWithoutBackground.value.includes(index);

const displayValue = (index) =>
    readonlyValues.value[index] !== undefined &&
    readonlyValues.value[index] !== null
        ? readonlyValues.value[index]
        : "";
</script>
