<template>
    <TownDetailsPanel>
        <template v-slot:title>Intervenants</template>
        <template v-slot:body>
            <TownDetailsPanelSection>
                <div class="italic mb-2">
                    Votre intervention mérite d'être signalée même si vous
                    n'accompagnez pas l'ensemble des habitants du site.
                </div>

                <div v-if="town.actors.length === 0" class="mt-2 mb-4">
                    <p>Aucun intervenant connu sur ce site.</p>
                    <Button
                        class="font-bold mt-4 mb-2"
                        variant="primaryOutlineAlt"
                        icon="plus"
                        iconPosition="left"
                        @click="$emit('showInviteActorModal')"
                        >Inviter un autre intervenant</Button
                    >
                </div>
                <div v-else class="grid grid-cols-2 mt-4">
                    <TownDetailsSelfCard
                        v-if="self"
                        :actor="self"
                        :townId="town.id"
                        @showThemesModal="$emit('showThemesModal')"
                    ></TownDetailsSelfCard>
                    <TownDetailsActorCard
                        v-for="actor in otherActors"
                        v-bind:key="actor.id"
                        :actor="actor"
                    ></TownDetailsActorCard>
                    <div class="p-4">
                        <Button
                            class="font-bold"
                            variant="primaryOutlineAlt"
                            icon="plus"
                            iconPosition="left"
                            @click="$emit('showInviteActorModal')"
                            >Inviter un autre intervenant</Button
                        >
                    </div>
                </div>

                <InfoBanner
                    v-if="isNotAnActor && !town.closedAt"
                    icon="flag"
                    buttonLabel="J'interviens sur ce site"
                    @click="$emit('click')"
                    class="mt-2 py-2"
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
            </TownDetailsPanelSection>
        </template>
    </TownDetailsPanel>
</template>

<script>
import TownDetailsPanel from "./ui/TownDetailsPanel.vue";
import TownDetailsActorCard from "./ui/TownDetailsActorCard.vue";
import TownDetailsSelfCard from "./ui/TownDetailsSelfCard.vue";
import TownDetailsPanelSection from "./ui/TownDetailsPanelSection.vue";
import { get as getConfig } from "#helpers/api/config";

export default {
    components: {
        TownDetailsPanel,
        TownDetailsPanelSection,
        TownDetailsActorCard,
        TownDetailsSelfCard
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
        self() {
            return this.town.actors.find(({ id }) => id === this.user.id);
        },
        otherActors() {
            return this.town.actors.filter(({ id }) => id !== this.user.id);
        },
        isNotAnActor() {
            return this.self === undefined;
        }
    }
};
</script>
