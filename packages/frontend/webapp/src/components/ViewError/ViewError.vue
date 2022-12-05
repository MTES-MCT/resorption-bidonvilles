<template>
    <div
        class="max-w-lg px-6 mx-auto flex flex-col items-center justify-center md:max-w-screen-lg md:flex-row md:space-x-8"
    >
        <img :src="img" class="max-w-xs w-3/4" />
        <div class="mt-10 md:mt-20 mb-10 md:mb-20">
            <h1 class="text-3xl font-bold">
                <slot name="title">Erreur</slot>
            </h1>
            <h2 class="text-G400" v-if="$slots.code">
                Code erreur : <slot name="code" />
            </h2>
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
import { defineProps, toRefs, computed } from "vue";
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
