<template>
    <div>
        <div class="text-display-xl font-bold leading-none">{{ line1 }}</div>
        <div class="text-md">{{ line2 }}</div>
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
    }
};
</script>
