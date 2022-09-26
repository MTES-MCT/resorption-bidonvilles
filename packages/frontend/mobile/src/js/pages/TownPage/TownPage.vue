<template>
    <Layout>
        <template slot="header">
            <Container>
                <header class="my-8">
                    <div
                        class="text-primary py-4 text-center"
                        @click="toTownsList"
                    >
                        <Icon :icon="'chevron-left'"></Icon>
                        <span> Retour à la liste des sites</span>
                    </div>
                    <div class="text-lg font-bold text-center">
                        {{ town.addressSimple }}
                        <span v-if="town.name" class="text-display-xs"
                            >« {{ town.name }} »</span
                        >
                    </div>
                </header>
            </Container>
        </template>
        <template slot="scroll">
            <Container>
                <div class="text-primary font-bold text-display-lg mb-4">
                    Caractéristiques
                </div>
                <TownPagePanelCharacteristics :town="town" />
                <div class="text-primary font-bold text-display-lg mt-8 mb-4">
                    Habitants
                </div>
                <TownPagePanelPeople :town="town" />
            </Container>
        </template>
    </Layout>
</template>
<script>
import Layout from "#src/js/components/Layout.vue";
import Container from "#src/js/components/Container.vue";
import TownPagePanelCharacteristics from "#src/js/pages/TownPage/TownPagePanelCharacteristics.vue";
import TownPagePanelPeople from "#src/js/pages/TownPage/TownPagePanelPeople.vue";
import { Icon } from "@resorptionbidonvilles/ui";

import { mapGetters } from "vuex";

export default {
    components: {
        Layout,
        Container,
        TownPagePanelCharacteristics,
        TownPagePanelPeople,
        Icon
    },
    data() {
        return {
            error: null
        };
    },
    computed: {
        ...mapGetters({
            town: "detailedTown",
            state: "townsState"
        })
    },
    async mounted() {
        if (this.state !== "loaded") {
            await this.$store.dispatch("fetchTowns");
        }
        try {
            await this.$store.commit("setDetailedTown", this.$route.params.id);
        } catch (error) {
            this.error = "Erreur: " + error.message;
        }
    },
    methods: {
        async toTownsList() {
            await this.$store.commit("setNavigationState", "list");
            this.$router.push(`/liste-des-sites`);
        }
    }
};
</script>
