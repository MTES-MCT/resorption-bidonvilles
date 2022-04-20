<template>
    <Icon icon="spinner" spin v-bind="$attrs" />
</template>

<script>
import Icon from "./Icon.vue";

export default {
    components: {
        Icon
    }
};
</script>