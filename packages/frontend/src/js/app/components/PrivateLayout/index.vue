<template>
    <div>
        <div class="print:hidden">
            <NavBar />
        </div>
        <slot />
    </div>
</template>

<script>
import NavBar from "#app/layouts/Navbar/Navbar.vue";
export default {
    components: {
        NavBar
    }
};
</script>
