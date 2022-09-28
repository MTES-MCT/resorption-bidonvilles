<template>
    <div>
        <NotificationGroup />
        <router-view />
    </div>
</template>

<script>
import NotificationGroup from "#src/js/components/Notification/NotificationGroup.vue";

export default {
    components: {
        NotificationGroup
    }
};
</script>
