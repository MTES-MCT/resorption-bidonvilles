<template>
    <span v-if="variant === 'small'"></span>
    <p v-else>
        <span class="font-bold">Message :</span> {{ activity.content }}
    </p>
</template>

<script>
module.exports = {
    props: {
        activity: {
            type: Object,
            required: true
        },
        variant: {
            // voir "ActivityCard.vue"
            type: String,
            required: true
        }
    }
};
</script>
