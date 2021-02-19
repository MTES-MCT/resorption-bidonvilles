<template>
    <TownDetailsPanel>
        <template v-slot:title>Intervenants</template>
        <template v-slot:body>
            Aucun intervenant connu sur ce site.
        </template>
    </TownDetailsPanel>
</template>

<script>
import TownDetailsPanel from "./ui/TownDetailsPanel.vue";

export default {
    components: {
        TownDetailsPanel
    }
};
</script>
