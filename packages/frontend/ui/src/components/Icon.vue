<template>
    <font-awesome-icon :icon="icon" :spin="spin" />
</template>

<script>
export default {
    name: "RbIcon",

    props: {
        icon: {
            type: [String, Array],
            required: true
        },
        spin: {
            type: Boolean
        }
    }
};
</script>
