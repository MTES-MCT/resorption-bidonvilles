<template>
    <header
        class="view-header fr-mb-5w"
        :class="{ 'fr-hidden fr-unhidden-xl': responsive }"
    >
        <div class="fr-grid-row fr-grid-row--middle">
            <div
                class="fr-grid-row fr-grid-row--middle"
                :class="classes.title.value"
            >
                <div
                    class="view-header__icon fr-grid-row fr-grid-row--center fr-grid-row--middle fr-background-action-high--blue-france fr-text-inverted--blue-france fr-mr-2w"
                    aria-hidden="true"
                >
                    <Icon :icon="icon" />
                </div>
                <div class="fr-col">
                    <component
                        :is="titleTag"
                        class="view-header__title fr-h4 fr-m-0"
                    >
                        <slot name="title" />
                    </component>
                    <p v-if="$slots.actionId" class="fr-text--sm fr-m-0">
                        <slot name="actionId" />
                    </p>
                    <p
                        v-if="$slots.description"
                        class="fr-text-default--grey fr-mb-0"
                    >
                        <slot name="description" />
                    </p>
                </div>
            </div>
            <div v-if="$slots.actions" :class="classes.actions.value">
                <slot name="actions" />
            </div>
        </div>
    </header>
</template>

<script setup>
import { toRefs, computed } from "vue";
import { Icon } from "@resorptionbidonvilles/ui";

const props = defineProps({
    icon: {
        type: String,
        required: true,
    },
    responsive: {
        // si true, alors ce bloc se masque automatiquement sur les écrans < xl de largeur
        type: Boolean,
        required: false,
        default: false,
    },
    direction: {
        type: String, // soit "col" pour un layout en colonne, soit "row" pour un layout en ligne (à partir d'une certaine largeur d'écran !)
        required: false,
        default: "row",
    },
    titleTag: {
        // balise du titre de la page : "h1" par défaut. À remplacer ("p", "div"...)
        // uniquement si la page porte déjà son propre <h1>, pour ne pas en dupliquer.
        type: String,
        required: false,
        default: "h1",
    },
});

const { direction } = toRefs(props);
const classes = {
    title: computed(() => {
        return direction.value === "row" ? "fr-col-12 fr-col-lg" : "fr-col-12";
    }),
    actions: computed(() => {
        return direction.value === "row"
            ? "fr-col-12 fr-mt-2w view-header__actions--row"
            : "fr-col-12 fr-mt-2w";
    }),
};
</script>

<style scoped>
/* Pastille ronde de l'icône : le DSFR ne propose pas d'utilitaire pour la forme ni la taille. */
.view-header__icon {
    flex: none;
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    font-size: 1.5rem;
}

/* Les titres (noms de sites, d'actions) peuvent être très longs : `overflow-wrap: anywhere`
   les coupe uniquement en cas de débordement (contrairement à l'ancien `break-all`). */
.view-header__title {
    overflow-wrap: anywhere;
}

/* À partir de lg (62em), les actions se placent à droite du titre, en largeur de contenu.
   Le DSFR n'a ni `fr-col-lg-auto` ni marge responsive (`fr-mt-lg-0`). */
@media (min-width: 62em) {
    .view-header__actions--row {
        flex: none;
        width: auto;
        max-width: none;
        margin-top: 0 !important;
    }
}

/* Le DSFR n'a pas d'utilitaire d'impression. */
@media print {
    .view-header {
        display: none !important;
    }
}
</style>
