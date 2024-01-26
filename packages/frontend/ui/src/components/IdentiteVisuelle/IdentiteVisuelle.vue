<template>
    <router-link to="/" aria-label="Retourner à la page d'accueil en mode connecté, sinon, au formulaire de connexion"
        class="flex items-center space-x-8 hover:bg-G100 p-3" :class="focusClasses.ring">
        <div class="flex flex-col items-start space-y-1">
            <img aria-hidden="true" :src="marianne" :class="sizeClass.marianneH" alt="" />
            <p class="uppercase font-bold" :class="sizeClass.textSize" aria-hidden="true">
                République<br />Française<br />
            </p>
            <img :src="devise" :class="sizeClass.deviseH" alt="" />
        </div>
        <img
            aria-hidden="true" 
            :src="logo"
            :class="`${sizeClass.logoH} ${
                keepLogo !== true ? 'hidden lg:inline' : ''
            }`"
            alt=""
        />
    </router-link>
</template>

<style scoped>
.devise {
    font-size: 0.78rem;
    line-height: 0.8rem;
}

.devise-lg {
    font-size: 1.18rem;
    line-height: 1.2rem;
}
</style>

<script setup>
import { toRefs, computed } from "vue";
import focusClasses from '../../../../common/utils/focus_classes';

import marianne from "./assets/marianne.svg";
import devise from "./assets/devise.svg";
import logo from "./assets/logo.svg";

const props = defineProps({
    keepLogo: {
        type: Boolean,
        default: false,
    },
    size: {
        type: String,
        default: "small",
    },
});

const sizes = {
    small: {
        marianneH: "h-3",
        textSize: "devise",
        deviseH: "h-6",
        logoH: "h-14",
    },
    large: {
        marianneH: "h-6",
        textSize: "devise-lg",
        deviseH: "h-9",
        logoH: "h-16",
    },
};
const { keepLogo, size } = toRefs(props);
const sizeClass = computed(() => {
    return sizes[size.value] || sizes.small;
});
</script>
