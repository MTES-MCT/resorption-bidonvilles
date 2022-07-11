<template>
    <div class="text-xs text-center">
        {{ formatStat(figure.figure) }}
        <span v-if="figure.dateFrom"
            >du {{ figure.dateFrom }} au {{ figure.date }}</span
        >
        <span v-else>{{ figure.date }}</span>
    </div>
</template>

<script>
import formatStat from "#app/utils/formatStat.js";

export default {
    props: {
        figure: {
            type: Object,
            required: true
        }
    },

    methods: {
        formatStat
    }
};
</script>
