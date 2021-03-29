<template>
    <div class="p-4 flex items-center justify-center border-2 border-black">
        <div class="flex flex-col items-center">
            <div class="text-display-md">{{ value }}</div>
            <div>{{ label }}</div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        label: {
            type: String
        },
        value: {
            type: [String, Number]
        }
    }
};
</script>
