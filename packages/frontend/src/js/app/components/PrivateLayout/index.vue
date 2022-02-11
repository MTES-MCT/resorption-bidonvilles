<template>
    <div>
        <div class="print:hidden">
            <NavBar />
        </div>
        <slot />
    </div>
</template>

<script>
import NavBar from "#app/layouts/NavbarV2/NavbarV2.vue";

export default {
    components: {
        NavBar
    }
};
</script>
