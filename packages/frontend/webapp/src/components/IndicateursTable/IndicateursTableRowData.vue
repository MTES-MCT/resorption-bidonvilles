<template>
    <IndicateursTableRow v-bind="$attrs">
        <template v-slot:label><slot /></template>
        <template v-slot:left>
            <div class="grid grid-cols-1">
                <p
                    v-for="(label, index) in labels"
                    :key="label"
                    class="flex items-center px-4 h-8 bg-G200"
                    :class="{
                        'border-b border-b-G400': index < labels.length - 1,
                    }"
                >
                    {{ label }}
                </p>
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
                            class="flex items-center justify-center h-8 bg-G200"
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
});
const { labels, data } = toRefs(props);
</script>
