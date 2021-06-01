<template>
    <div>
        <h2 class="text-display-lg text-secondary">{{ title }}</h2>
        <slot name="info" />
        <div class="grid grid-cols-1 md:grid-cols-3 gap-16 mt-8">
            <slot />
        </div>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            required: true,
            type: String
        }
    }
};
</script>
