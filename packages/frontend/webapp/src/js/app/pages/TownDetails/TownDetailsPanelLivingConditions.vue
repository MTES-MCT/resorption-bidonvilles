<template>
  <DetailsPanel>
    <template v-slot:title>Conditions de vie et environnement</template>
    <template v-slot:body> </template>
  </DetailsPanel>
</template>

<script>
import DetailsPanel from "#app/components/ui/details/DetailsPanel.vue";
import TownDetailsPanelLivingConditionsSection from "./ui/TownDetailsPanelLivingConditionsSection";
import serializeLivingConditions from "#frontend/common/helpers/town/living_conditions/serializeLivingConditions";
</script>
