<template>
    <div>
        <div class="v1">
            <NavBar />
        </div>
        <slot />
    </div>
</template>

<script>
import NavBar from "#app/layouts/navbar/navbar.vue";

export default {
    components: {
        NavBar
    }
};
</script>
