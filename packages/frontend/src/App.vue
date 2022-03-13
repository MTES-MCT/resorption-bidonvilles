<template>
    <div id="app">
        <router-view />
        <NotificationsGroup />
    </div>
</template>

<script>
export default {
    mounted() {
        window.addEventListener("callRouter", ({ detail }) => {
            this.$router[detail.routerMethod](...(detail.routerArgs || []));
        });
    }
};
</script>
