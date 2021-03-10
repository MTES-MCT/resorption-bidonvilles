<template>
    <div>
        <div class="sticky stickyColumn">
            <div class="font-bold">Rubriques</div>
            <LeftColumnNavLink
                to="#characteristics"
                :activeSection="activeSection === 'characteristics'"
                >Caractéristiques du site</LeftColumnNavLink
            >
            <LeftColumnNavLink
                to="#people"
                :activeSection="activeSection === 'people'"
                >Habitants</LeftColumnNavLink
            >
            <LeftColumnNavLink
                to="#living_conditions"
                :activeSection="activeSection === 'living_conditions'"
                >Conditions de vie et environnement</LeftColumnNavLink
            >
            <LeftColumnNavLink
                v-if="hasJusticePermission"
                to="#judicial"
                :activeSection="activeSection === 'judicial'"
                >Procédure judiciaire</LeftColumnNavLink
            >
            <LeftColumnNavLink
                to="#intervenants"
                :activeSection="activeSection === 'intervenants'"
                >Intervenants</LeftColumnNavLink
            >
            <router-link
                v-if="town.comments.regular.length > 0"
                to="#comments"
                @click.native="scrollFix('#comments')"
                class="text-secondary"
            >
                <div class="flex text-secondary font-bold mt-4 cursor-pointer">
                    <Icon icon="comment" />
                    <div class="ml-2">
                        <div>Le journal du site</div>
                        <div>
                            {{ town.comments.regular.length }} message{{
                                town.comments.regular.length > 1 ? "s" : ""
                            }}
                        </div>
                    </div>
                </div>
            </router-link>
            <div
                class="flex text-primary font-bold mt-4 cursor-pointer"
                @click="$emit('openHistory')"
            >
                <Icon icon="history" />
                <div class="ml-2">Voir l'historique des modifications</div>
            </div>
        </div>
    </div>
</template>

<script>
import LeftColumnNavLink from "#app/pages/TownDetails/ui/LeftColumnNavLink";
import { hasPermission } from "#helpers/api/config";

export default {
    components: { LeftColumnNavLink },
    props: {
        town: {
            type: Object
        },
        hasJusticePermission: {
            type: Boolean
        }
    },
    data() {
        return {
            activeSection: "characteristics"
        };
    },
    methods: {
        hasPermission,
        // Force scroll even if hash is already present in url
        scrollFix(to) {
            if (to === this.$route.hash) {
                const el = document.getElementById(to.slice(1));
                if (el) {
                    window.scrollTo(0, el.offsetTop);
                }
            }
        }
    },
    mounted() {
        const callback = entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.activeSection = entry.target.id;
                }
            });
        };

        let observer = new IntersectionObserver(callback, {
            rootMargin: "0px",
            threshold: 0.5
        });

        observer.observe(document.querySelector("#intervenants"));
        this.hasJusticePermission &&
            observer.observe(document.querySelector("#judicial"));
        observer.observe(document.querySelector("#living_conditions"));
        observer.observe(document.querySelector("#people"));
        observer.observe(document.querySelector("#characteristics"));
    }
};
</script>

<style scoped>
.stickyColumn {
    top: 32px;
}
</style>
