<template>
    <div>
        <Icon icon="flag"></Icon>
        <span class="ml-2 font-bold">Qu'est-ce qu'un site ?</span>
        <span class="ml-2" @click="toggle"
            ><Icon :icon="togglerIcon" class="cursor-pointer"></Icon
        ></span>
        <transition name="toggle" mode="out-in">
            <div class="bg-yellow-200 text-sm p-6 mt-2 flex" v-if="visible">
                Un site est un bidonville, squat ou immeuble bâti occupé de
                manière informelle à des fins d'habitation par plusieurs
                familles ou personnes. Il se caractérise généralement par
                l'absence de services de base : eau, électricité, gestion des
                déchets. La plateforme permet de recenser tous les sites,
                quelque soit l'origine des personnes et leur nombre.
            </div>
        </transition>
    </div>
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
