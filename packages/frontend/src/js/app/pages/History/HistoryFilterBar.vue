<template>
    <div class="flex justify-between">
        <HistoryFilters></HistoryFilters>
        <HistorySort></HistorySort>
    </div>
</template>

<script>
import HistoryFilters from "./HistoryFilters.vue";
import HistorySort from "./HistorySort.vue";

export default {
    components: {
        HistoryFilters,
        HistorySort
    }
};
</script>
