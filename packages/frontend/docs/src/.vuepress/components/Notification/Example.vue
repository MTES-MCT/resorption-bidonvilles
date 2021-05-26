<template>
    <div>
        <NotificationsGroup />
        <Button @click="toggleNotif">Click me</Button>
    </div>
</template>

<script>

    export default {
        methods: {
            toggleNotif() {
                this.$notify({
                    group: 'notifications',
                    title: 'Important message',
                    text: 'Hello user! This is a notification!'
                });
            }
        }
    }
</script>

