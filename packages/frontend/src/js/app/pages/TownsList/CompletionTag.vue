<template>
    <Tag :class="['text-xs uppercase text-primary relative']">
        Site complété à
        {{ Math.floor(completion * 100).toFixed(0) }}%
        <div
            :class="['absolute', 'bg-info', 'h-px', 'bottom-0', 'left-0']"
            :style="{ width: Math.floor(completion * 100) + '%' }"
        ></div>
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
