<template>
    <div class="flex justify-between">
        <CovidHistoryDateColumn
            :date="date"
            class="w-48 pr-4 mr-4 mt-4 border-r-4 border-blue100"
        ></CovidHistoryDateColumn>
        <CovidHistoryCardsColumn
            :items="items"
            class="flex-1 border-t pt-4"
        ></CovidHistoryCardsColumn>
    </div>
</template>

<script>
import CovidHistoryDateColumn from "./CovidHistoryDateColumn.vue";
import CovidHistoryCardsColumn from "./CovidHistoryCardsColumn.vue";

export default {
    props: {
        date: {
            type: Date,
            required: true
        },
        items: {
            type: Array,
            required: true
        }
    },
    components: {
        CovidHistoryDateColumn,
        CovidHistoryCardsColumn
    }
};
</script>
