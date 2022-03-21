<template>
    <TabList :tabs="tabs" :value="display" @input="changeDisplay" />
</template>

<script>
import TabList from "#app/components/TabList/TabList.vue";
import { mapGetters } from "vuex";

export default {
    props: {
        tabs: {
            type: Array
        }
    },
    components: {
        TabList
    },
    methods: {
        changeDisplay(id) {
            if (id === this.display) {
                return;
            }

            const { track_id: trackId } = this.tabs.find(tab => tab.id === id);
            this.$trackMatomoEvent("TB", `Vue ${trackId}`);
            this.$store.commit("dashboard/setDashboardShantytownsDisplay", id);
        }
    },
    computed: {
        ...mapGetters({
            display: "dashboard/dashboardShantytownsDisplay"
        })
    }
};
</script>
