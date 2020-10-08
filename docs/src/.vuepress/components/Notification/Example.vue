<template>
    <div>
        <!-- It should be included only once in App.html-->
        <notifications group="notifications" position="top center" style="width: 410px" class="customNotifications">
            <template slot="body" slot-scope="props">
                <div :class="['vue-notification', props.item.type]" @click="props.close">
                    <div class="notification-icon"></div>
                    <div class="notification-content">
                        <div class="notification-title">{{props.item.title}}</div>
                        <div class="notification-content" v-html="props.item.text"></div>
                    </div>
                </div>
            </template>
        </notifications>
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
