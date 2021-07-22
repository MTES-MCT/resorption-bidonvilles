<template>
    <ActivityCard :activity="item"></ActivityCard>
</template>

<script>
export default {
    props: {
        item: {
            type: Object,
            required: true
        }
    }
};
</script>
