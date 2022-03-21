<template>
    <Guard>
        <Page />
    </Guard>
</template>

<script>
export default {
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.track(from);
        });
    },
    beforeRouteUpdate(to, from, next) {
        this.track(from);
        next();
    },
    components: {
        Page: () => import("./TownDetails.vue")
    },
    methods: {
        track({ path: from }) {
            if (from !== "/tableau-de-bord") {
                return;
            }

            this.$trackMatomoEvent(
                "TB",
                "Visite page site",
                `S${this.$route.params.id}`
            );
        }
    }
};
</script>
