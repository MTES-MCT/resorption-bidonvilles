<template>
    <div class="inline-block border-blue300 px-3 text-primary">
        <span
            :class="isSelected ? 'bg-primary text-white rounded px-2 py-1' : ''"
            ><a :href="`#${item.id}`"> {{ item.label }}</a></span
        >
    </div>
</template>

<script>
export default {
    props: {
        item: Object,
        isSelected: Boolean,
    },
};
</script>
