<template>
    <div class="has-tooltip">
        <div class="tooltip mt-8 bg-yellow-200 text-black py-4 px-6">
            {{ text }}
        </div>
        <slot />
    </div>
</template>

<script>
export default {
    props: {
        text: {
            type: String
        }
    }
};
</script>

<style scoped>
.tooltip {
    @apply invisible absolute;
}

.has-tooltip:hover .tooltip {
    @apply visible z-50;
}
</style>
