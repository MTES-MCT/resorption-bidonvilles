<template>
    <PrivateLayout>
        <PrivateContainer class="pt-10 mb-12">
            <DashboardHeader />
        </PrivateContainer>
    </PrivateLayout>
</template>

<script>
import PrivateLayout from "#app/components/PrivateLayout";
import PrivateContainer from "#app/components/PrivateLayout/PrivateContainer";
import DashboardHeader from "./DashboardHeader/DashboardHeader";

export default {
    components: {
        PrivateLayout,
        PrivateContainer,
        DashboardHeader
    }
};
</script>
