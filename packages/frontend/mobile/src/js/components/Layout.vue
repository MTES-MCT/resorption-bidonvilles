<template>
    <div>
        <header class="mt-8 mb-6 flex items-center justify-center space-x-2">
            <img
                class="h-10"
                src="/img/logo-marianne.svg"
                alt="République Française"
            />
            <h1 class="font-bold text-xl">Résorption-bidonvilles</h1>
        </header>
        <slot />
        <Navbar />
    </div>
</template>

<script>
import Navbar from "./Navbar/Navbar.vue";

export default {
    components: {
        Navbar
    }
};
</script>
