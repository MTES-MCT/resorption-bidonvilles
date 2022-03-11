<template>
    <router-link :to="target">
        <p :class="classes">
            {{ label }}
        </p>
    </router-link>
</template>
<script>
export default {
    props: {
        target: {
            type: String,
            required: true
        },
        label: {
            type: String,
            required: true
        },
        classes: {
            type: String,
            required: false
        }
    }
};
</script>
