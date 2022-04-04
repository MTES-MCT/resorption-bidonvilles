<template>
    <div class="flex mb-2">
        <div class="w-48">{{ label }}</div>
        <div class="font-bold"><slot /></div>
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
