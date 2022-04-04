<template>
    <span>
        {{ content }}
    </span>
</template>

<script>
export default {
    props: {
        content: {
            type: [String, Number],
            required: true
        }
    }
};
</script>
