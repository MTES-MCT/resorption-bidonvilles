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
                to="#judicial"
                :activeSection="activeSection === 'judicial'"
                >Procédure judiciaire</LeftColumnNavLink
            >
        </div>
    </div>
</template>

<script>
import LeftColumnNavLink from "#app/components/TownForm/ui/LeftColumnNavLink";
export default {
    components: { LeftColumnNavLink },
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
