<template>
    <div
        :class="[
            'inline-block border-blue300 px-2 text-primary',
            isSelected ? 'font-bold' : 'underline',
        ]"
    >
        <a :href="`#${item.id}`"> {{ item.label }}</a>
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
