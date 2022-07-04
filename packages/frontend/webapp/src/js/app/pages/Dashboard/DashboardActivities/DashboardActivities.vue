<template>
    <DashboardSection title="Activité" id="activite">
        <template slot="body">
            <section class="flex">
                <DashboardActivitiesFilters
                    class="w-48 pt-8 sticky top-0 self-start"
                />
                <DashboardActivitiesList class="ml-24 -mt-1 flex-1" />
            </section>
        </template>
    </DashboardSection>
</template>

<script>
import DashboardSection from "../DashboardSection";
import DashboardActivitiesFilters from "./DashboardActivitiesFilters";
import DashboardActivitiesList from "./DashboardActivitiesList";

export default {
    components: {
        DashboardSection,
        DashboardActivitiesFilters,
        DashboardActivitiesList
    }
};
</script>
