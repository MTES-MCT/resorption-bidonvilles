<template>
    <div class="inline-block" v-bind:class="disabled ? [] : 'has-tooltip'">
        <div
            class="tooltip mt-10 ml-5 bg-yellow-200 shadow-md text-black py-4 px-6"
        >
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
        },
        disabled: {
            type: Boolean,
            default: false
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
