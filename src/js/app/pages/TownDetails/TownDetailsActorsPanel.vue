<template>
    <TownDetailsPanel>
        <template v-slot:title>Intervenants</template>
        <template v-slot:body>
            <p>Aucun intervenant connu sur ce site.</p>

            <InfoBanner
                v-if="isNotAnActor"
                icon="flag"
                buttonLabel="J'interviens sur ce site"
                @click="$emit('click')"
                class="mt-4 py-2"
            >
                <template v-slot:body>
                    <p class="ml-2 inline-block">
                        <span class="font-bold"
                            >Vous intervenez sur ce site ?</span
                        >
                        Faites le savoir à la communauté.
                    </p>
                </template>
            </InfoBanner>
        </template>
    </TownDetailsPanel>
</template>

<script>
import TownDetailsPanel from "./ui/TownDetailsPanel.vue";
import { get as getConfig } from "#helpers/api/config";

export default {
    data() {
        const { user } = getConfig();
        return {
            user
        };
    },
    computed: {
        town() {
            return this.$store.state.detailedTown;
        },
        isNotAnActor() {
            return !this.town.actors.some(({ id }) => id === this.user.id);
        }
    },
    components: {
        TownDetailsPanel
    }
};
</script>
