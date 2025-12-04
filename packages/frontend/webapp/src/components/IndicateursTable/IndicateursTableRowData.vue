<template>
    <IndicateursTableRow v-bind="$attrs">
        <template v-slot:label><slot /></template>
        <template v-slot:left>
            <div class="grid grid-cols-1">
                <p
                    v-for="(label, index) in labels"
                    :key="label"
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
            <div class="whitespace-nowrap flex items-stretch">
                <IndicateursTableRowCell
                    class="flex items-center"
                    v-for="(year, index) in data"
                    :key="index"
                >
                    <div class="grid grid-cols-1 flex-1">
                        <p
                            v-for="(figure, index2) in year"
                            :key="index2"
                            class="flex items-center justify-center min-h-20 bg-G200"
                            :class="{
                                'border-b border-b-G400':
                                    index2 < year.length - 1,
                            }"
                        >
                            {{ figure }}
                        </p>
                    </div>
                </IndicateursTableRowCell>
            </div>
        </template>
    </IndicateursTableRow>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import IndicateursTableRow from "./IndicateursTableRow.vue";
import IndicateursTableRowCell from "./IndicateursTableRowCell.vue";

const props = defineProps({
    labels: {
        type: Array,
        required: true,
    },
    data: {
        type: Array,
        required: true,
    },
    labelsWithoutBackground: {
        type: Array,
        default: () => [],
    },
});
const { labels, data, labelsWithoutBackground } = toRefs(props);

const hasBackground = (index) =>
    labelsWithoutBackground.value.includes(index) === false;
</script>
