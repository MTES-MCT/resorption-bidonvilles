<template>
    <section class="fixed top-0 left-0 w-full z-10">
        <Notification v-for="item in items" v-bind="item" :key="item.id" />
    </section>
</template>

<script>
import Notification from "./Notification.vue";

export default {
    components: {
        Notification
    },
    computed: {
        items() {
            return this.$store.state.notifications.items;
        }
    }
};
</script>
