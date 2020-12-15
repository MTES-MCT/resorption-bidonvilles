<template>
    <div class="mb-12">
        <div class="font-bold mb-4">{{ title }}</div>
        <div class="text-sm mb-4">{{ info }}</div>
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
