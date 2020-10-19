<template>
    <font-awesome-icon :icon="icon" :spin="spin" v-bind="$attrs" />
</template>

<script>
    export default {
        name: 'Icon',
        props: {
            icon: {
                type: String,
                required: true
            },
            spin: {
                type: Boolean
            }

        },
    }
</script>
