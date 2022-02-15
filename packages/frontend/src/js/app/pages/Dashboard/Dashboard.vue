<template>
    <PrivateLayout>
        <PrivateContainer class="pt-10 mb-12">
            <DashboardGlobalView />
            <DashboardShantytowns />
            <DashboardActivities class="mt-16" />
        </PrivateContainer>
    </PrivateLayout>
</template>

<script>
import PrivateLayout from "#app/components/PrivateLayout";
import PrivateContainer from "#app/components/PrivateLayout/PrivateContainer";

import DashboardShantytowns from "./DashboardShantytowns/DashboardShantytowns";
import DashboardGlobalView from "./DashboardGlobalView/DashboardGlobalView";
import DashboardActivities from "./DashboardActivities/DashboardActivities";

export default {
    components: {
        PrivateLayout,
        PrivateContainer,
        DashboardShantytowns,
        DashboardGlobalView,
        DashboardActivities
    }
};
</script>
