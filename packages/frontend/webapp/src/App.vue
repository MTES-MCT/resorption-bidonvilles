<template>
    <div>
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
    },

    watch: {
        $route: {
            handler(to) {
                document.title = to.meta.title || "Résorption-bidonvilles";
            },
            immediate: true
        }
    }
};
</script>
