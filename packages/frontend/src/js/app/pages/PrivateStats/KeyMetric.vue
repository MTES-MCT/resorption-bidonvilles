<template>
    <div class="py-4 flex  justify-center border-2 border-black">
        <div class="flex flex-col items-center">
            <div class="text-display-md">{{ value }}</div>
            <div>{{ label }}</div>
            <div class="text-xs text-center">{{ info }}</div>
        </div>
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
        },
        value: {
            type: [String, Number]
        }
    }
};
</script>
