<template>
    <div
        :class="[
            'flex flex-row items-center text-sm border-b border-color-G600 py-1',
            spaceBetween ? 'justify-between' : ''
        ]"
    >
        <div :class="['max-w-2xl', !spaceBetween && 'mr-4']">{{ label }}</div>
        <div>
            <slot />
        </div>
    </div>
</template>

<script>
export default {
    props: {
        label: {
            type: String
        },
        spaceBetween: {
            type: Boolean,
            default: true
        }
    }
};
</script>
