<template>
    <PanelInfo icon="flag">
        <template v-slot:title>Qu'est-ce qu'un site ?</template>
        <template v-slot:content>
            Un site est un bidonville ou squat occupé de manière informelle à
            des fins d'habitation par plusieurs familles ou personnes, les
            services de base (eau, électricité, gestion des déchets…) y sont
            généralement absents. Tous les sites, quelque soit l'origine et le
            nombre des personnes, peuvent être renseignés.
        </template>
    </PanelInfo>
</template>

<style scoped>
.toggle-enter-active,
.toggle-leave-active {
    transition: all 0.3s;
    max-height: 500px;
}

.toggle-enter,
.toggle-leave-to {
    opacity: 0;
    max-height: 0px;
}
</style>

<script>
export default {
    data() {
        return {
            visible: true
        };
    },

    computed: {
        togglerIcon() {
            if (this.visible === true) {
                return "chevron-up";
            }

            return "chevron-down";
        }
    },

    methods: {
        toggle() {
            this.visible = !this.visible;
        }
    }
};
</script>
