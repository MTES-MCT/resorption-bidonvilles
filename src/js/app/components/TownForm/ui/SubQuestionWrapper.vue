<template>
    <div
        class="flex flex-row items-center justify-between border-b border-color-G600 py-1 text-sm"
    >
        <div class="max-w-2xl">{{ label }}</div>
        <div class="-mb-8">
            <slot />
        </div>
    </div>
</template>

<script>
export default {
    props: {
        label: {
            type: String
        }
    }
};
</script>
