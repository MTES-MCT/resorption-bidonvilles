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
                >Conditions de vie</LeftColumnNavLink
            >
            <LeftColumnNavLink
                to="#judicial"
                :activeSection="activeSection === 'judicial'"
                >Procédure judiciaire</LeftColumnNavLink
            >
            <LeftColumnNavLink
                to="#comments"
                :activeSection="activeSection === 'comments'"
            >
                {{ town.comments.regular.length }}
                commentaires</LeftColumnNavLink
            >
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
export default {
    components: { LeftColumnNavLink },
    props: {
        town: {
            type: Object
        }
    },
    data() {
        return {
            activeSection: "characteristics"
        };
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
            threshold: 1.0
        });

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
