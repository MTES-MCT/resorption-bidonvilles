<template>
    <div class="text-right">
        <Tag variant="date">{{ formatDate(date.getTime() / 1000) }}</Tag>
    </div>
</template>

<script>
import formatDate from "./utils/formatDate";

export default {
    props: {
        date: {
            type: Date,
            required: true
        }
    },

    methods: {
        formatDate
    }
};
</script>
