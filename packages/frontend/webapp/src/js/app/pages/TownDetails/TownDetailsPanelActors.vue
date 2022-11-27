<template>
  <DetailsPanel>
    <template v-slot:title>Intervenants</template>
    <template v-slot:body>
      <DetailsPanelSection>
        <TownDetailsSelfCard
          v-if="self"
          :actor="self"
          :townId="town.id"
          @showThemesModal="$emit('showThemesModal')"
        ></TownDetailsSelfCard>
      </DetailsPanelSection>
    </template>
  </DetailsPanel>
</template>
