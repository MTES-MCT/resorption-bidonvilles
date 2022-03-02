<template>
    <DashboardSection title="Vue d'ensemble" id="global_view">
        <template slot="body">
            <DashboardGlobalViewList />
        </template>
    </DashboardSection>
</template>

<script>
import DashboardSection from "../DashboardSection";
import DashboardGlobalViewList from "./DashboardGlobalViewList.vue";
export default {
    components: {
        DashboardSection,
        DashboardGlobalViewList
    }
};
</script>
