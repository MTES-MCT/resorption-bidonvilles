<template>
    <div class="flex flex-1 justify-between">
        <HistoryDateColumn
            :date="date"
            class="w-48 pr-4 mr-4 mt-4 border-r-4 border-blue100"
        ></HistoryDateColumn>
        <HistoryCardsColumn
            :items="items"
            class="flex-1 border-t-1 pt-4"
        ></HistoryCardsColumn>
    </div>
</template>

<script>
import HistoryDateColumn from "./HistoryDateColumn.vue";
import HistoryCardsColumn from "./HistoryCardsColumn.vue";

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
        HistoryDateColumn,
        HistoryCardsColumn
    }
};
</script>
