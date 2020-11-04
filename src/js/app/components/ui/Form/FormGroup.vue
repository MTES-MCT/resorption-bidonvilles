<template>
    <div>
        <div class="text-display-lg mb-8">{{ title }}</div>
        <slot />
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String
        }
    }
};
</script>
