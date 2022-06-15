<template>
    <div class="flex items-center">
        <div class="mr-2">
            {{ formatDate(closedAt) }}
        </div>
    </div>
</template>

<script>
export default {
    props: {
        closedAt: {
            type: Number,
            required: true
        }
    },
    methods: {
        formatDate(timestamp) {
            const dateObject = new Date(timestamp * 1000);
            const year = dateObject.getFullYear();
            const month = `${dateObject.getMonth() + 1}`.padStart(2, "0");
            const day = `${dateObject.getDate()}`.padStart(2, "0");

            return `${day}/${month}/${year}`;
        }
    }
};
</script>
