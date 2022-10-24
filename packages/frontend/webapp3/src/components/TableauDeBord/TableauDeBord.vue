<template>
    <ContentWrapper>
        <TableauDeBordHeader />
        <TableauDeBordVueEnsemble class="mt-12" />
        <TableauDeBordSites class="mt-12" />
        <TableauDeBordActivites class="mt-12" />
    </ContentWrapper>
</template>

<script setup>
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper.vue";
import TableauDeBordHeader from "./TableauDeBordHeader.vue";
import TableauDeBordVueEnsemble from "./TableauDeBordVueEnsemble/TableauDeBordVueEnsemble.vue";
import TableauDeBordSites from "./TableauDeBordSites/TableauDeBordSites.vue";
import TableauDeBordActivites from "./TableauDeBordActivites/TableauDeBordActivites.vue";
</script>
