<template>
    <div
        class="max-w-lg px-6 mx-auto flex flex-col items-center justify-center md:max-w-screen-lg md:flex-row md:space-x-8"
    >
        <img :src="img" class="max-w-xs w-3/4" alt="" />
        <div class="mt-10 md:mt-20 mb-10 md:mb-20">
            <component :is="titleTag" class="text-3xl font-bold">
                <slot name="title">Erreur</slot>
            </component>
            <p class="text-G400" v-if="$slots.code">
                Code erreur : <slot name="code" />
            </p>
            <article class="mt-4">
                <slot name="content" />
            </article>
            <p class="mt-6 flex space-x-6">
                <slot name="actions">
                    <ButtonContact />
                </slot>
            </p>
        </div>
    </div>
</template>

<script setup>
import { toRefs, computed } from "vue";
import erreurImg from "@/assets/img/illustrations/erreur.svg";
import interditImg from "@/assets/img/illustrations/interdit.svg";
import videImg from "@/assets/img/illustrations/vide.svg";
import ButtonContact from "@/components/ButtonContact/ButtonContact.vue";

const props = defineProps({
    variant: {
        type: String, // valeurs possibles : "erreur", "interdit", "vide"
        required: false,
        default: "erreur",
    },
    titleTag: {
        // balise du titre : "h1" par défaut (page entière en erreur, cf. LayoutError).
        // À passer à "h2" quand la page porte déjà son propre <h1>, pour ne pas en dupliquer.
        type: String,
        required: false,
        default: "h1",
    },
});

const { variant } = toRefs(props);
const variants = {
    erreur: erreurImg,
    interdit: interditImg,
    vide: videImg,
};
const img = computed(() => {
    return variants[variant.value];
});
</script>
