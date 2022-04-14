<template>
    <div>
        <div class="text-md">{{ line1 }}</div>
        <div class="text-display-xl font-bold leading-none">{{ line2 }}</div>
        <div class="text-md">{{ line3 }}</div>
    </div>
</template>

<script>
export default {
    props: {
        line1: {
            type: String,
            required: true
        },
        line2: {
            type: String,
            required: true
        },
        line3: {
            type: String,
            required: true
        }
    }
};
</script>
