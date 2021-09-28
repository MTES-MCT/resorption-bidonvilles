<template>
    <Tag
        :class="['text-xs uppercase text-primary', isHover ? 'shadow-md' : '']"
    >
        Site completé à
        {{ Math.floor(completion * 100).toFixed(0) }}%
    </Tag>
</template>

<script>
export default {
    props: {
        completion: {
            type: Number
        }
    }
};
</script>
