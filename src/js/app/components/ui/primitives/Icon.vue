<template>
    <font-awesome-icon :icon="icon" />
</template>

<script>
    export default {
        name: 'Icon',
        props: {
            icon: {
                type: String,
                required: true
            }

        },
    }
</script>
