<template>
    <div>
        <div class="text-secondary text-display-md font-bold">{{ label }}</div>
        <slot />
    </div>
</template>

<script>
export default {
    props: {
        label: {
            type: String,
            required: true
        }
    }
};
</script>
