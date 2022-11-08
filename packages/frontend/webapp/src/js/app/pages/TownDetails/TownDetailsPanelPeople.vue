<template>
  <DetailsPanel>
    <template v-slot:title>Habitants</template>
    <template v-slot:body>
      <DetailsPanelSection>
        <p class="font-bold">
          S'agit-t-il d'une réinstallation ?
        </p>
        <p>
          {{ boolToStr(town.isReinstallation) }}
        </p>
      </DetailsPanelSection>
      <DetailsPanelSection v-if="town.reinstallationComments !== null">
        <p class="font-bold">
          Précisions sur la réinstallation
        </p>
        <p
          data-cy-data="reinstallation_comments"
          class="w-200 break-words whitespace-pre-wrap"
        >
          {{ town.reinstallationComments }}
        </p>
      </DetailsPanelSection>
    </template>
  </DetailsPanel>
</template>

<style scoped>
.border-b-black-custom {
  border-bottom-color: black;
}
</style>
