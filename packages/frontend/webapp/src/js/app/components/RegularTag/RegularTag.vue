<template>
    <Tag
        variant="withoutBackground"
        :class="[
            'inline-block text-blue600 ',
            tag.type === 'ordinaire' ? 'bg-blue200' : 'bg-red300'
        ]"
        >{{ tag.label }}
    </Tag>
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
