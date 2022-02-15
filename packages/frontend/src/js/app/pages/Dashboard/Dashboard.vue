<template>
    <PrivateLayout>
        <PrivateContainer class="pt-10 mb-12">
<<<<<<< HEAD
<<<<<<< HEAD
            <DashboardHeader />
=======
=======
            <DashboardGlobalView />
>>>>>>> 261a4318 ((1338) vue d'ensemble fusion avec vignettes)
            <DashboardShantytowns />
>>>>>>> 1c3f950f ((1348) Setup Dashboard shantytowns)
        </PrivateContainer>
    </PrivateLayout>
</template>

<script>
import PrivateLayout from "#app/components/PrivateLayout";
import PrivateContainer from "#app/components/PrivateLayout/PrivateContainer";
<<<<<<< HEAD
import DashboardHeader from "./DashboardHeader/DashboardHeader";
=======

import DashboardShantytowns from "./DashboardShantytowns/DashboardShantytowns";
<<<<<<< HEAD
>>>>>>> 1c3f950f ((1348) Setup Dashboard shantytowns)
=======
import DashboardGlobalView from "./DashboardGlobalView/DashboardGlobalView";
>>>>>>> 261a4318 ((1338) vue d'ensemble fusion avec vignettes)

export default {
    components: {
        PrivateLayout,
        PrivateContainer,
<<<<<<< HEAD
<<<<<<< HEAD
        DashboardHeader
=======
        DashboardShantytowns
>>>>>>> 1c3f950f ((1348) Setup Dashboard shantytowns)
=======
        DashboardShantytowns,
        DashboardGlobalView
>>>>>>> 261a4318 ((1338) vue d'ensemble fusion avec vignettes)
    }
};
</script>
