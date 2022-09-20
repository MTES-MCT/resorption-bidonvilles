<template>
    <div>
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
