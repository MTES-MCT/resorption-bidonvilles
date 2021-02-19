<template>
    <TownDetailsPanel>
        <template v-slot:title>Intervenants</template>
        <template v-slot:body>
            <p v-if="town.actors.length === 0">
                Aucun intervenant connu sur ce site.
            </p>
            <div v-else class="grid grid-cols-2">
                <TownDetailsActorCard
                    v-for="actor in town.actors"
                    v-bind:key="actor.id"
                    :actor="actor"
                ></TownDetailsActorCard>
            </div>

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
import TownDetailsActorCard from "./ui/TownDetailsActorCard.vue";
import { get as getConfig } from "#helpers/api/config";

export default {
    components: {
        TownDetailsPanel,
        TownDetailsActorCard
    },

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
    }
};
</script>
