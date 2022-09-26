<template>
    <div class="grid grid-cols-2 py-2">
        <div class="font-bold">
            {{ title }}
        </div>
        <slot />
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            required: true
        }
    }
};
</script>
