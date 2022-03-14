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
            this.$store.commit("setDashboardShantytownsDisplay", id);
        }
    },
    computed: {
        ...mapGetters({
            display: "dashboardShantytownsDisplay"
        })
    }
};
</script>
