<template>
    <Tag
        variant="withoutBackground"
        :class="[
            'inline-block',
            tag.type === 'warning' ? 'bg-orange300' : 'bg-red300'
        ]"
        >{{ tag.label }}</Tag
    >
</template>

<script>
export default {
    props: {
        tag: {
            type: Object,
            required: true
        }
    }
};
</script>
