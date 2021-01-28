<template>
    <div>
        <div v-if="label" class="mb-2 font-bold">{{ label }}</div>
        <div v-if="info" class="mb-3 italic text-G600">{{ info }}</div>
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
