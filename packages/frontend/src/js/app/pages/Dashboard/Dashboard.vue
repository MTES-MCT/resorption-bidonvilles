<template>
    <PrivateLayout>
        <PrivateContainer class="pt-10 mb-12">
            <DashboardHeader />
            <DashboardShantytowns class="mt-12" />
            <DashboardActivities class="mt-12" />
        </PrivateContainer>
    </PrivateLayout>
</template>

<script>
import PrivateLayout from "#app/components/PrivateLayout";
import PrivateContainer from "#app/components/PrivateLayout/PrivateContainer";
import DashboardHeader from "./DashboardHeader/DashboardHeader";
import DashboardShantytowns from "./DashboardShantytowns/DashboardShantytowns";
import DashboardActivities from "./DashboardActivities/DashboardActivities";

export default {
    components: {
        PrivateLayout,
        PrivateContainer,
        DashboardHeader,
        DashboardShantytowns,
        DashboardActivities
    }
};
</script>
