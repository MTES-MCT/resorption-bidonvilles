<template>
    <div>
        <div v-if="label" class="mb-2 text-sm">{{ label }}</div>
        <div v-if="info" class="mb-3 text-xs">{{ info }}</div>
    </div>
</template>

<script>
export default {
    props: {
        label: {
            type: String
        },
        info: {
            type: String
        }
    }
};
</script>
