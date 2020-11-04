<template>
    <div class="mb-12">
        <div class="text-display-xs mb-4">{{ title }}</div>
        <div class="text-xs mb-4">{{ info }}</div>
        <slot />
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String
        },
        info: {
            type: String
        }
    }
};
</script>
