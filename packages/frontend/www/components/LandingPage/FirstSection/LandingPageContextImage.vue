<template>
    <div>
        <p class="text-secondary text-display-md font-bold">{{ label }}</p>
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
