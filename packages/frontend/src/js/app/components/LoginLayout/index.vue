<template>
    <div>
        <div class="v1">
            <NavBar></NavBar>
        </div>

        <div class="max-w-sm mx-auto py-20">
            <img class="h-32 mx-auto mb-8" src="./assets/bidonvilles.png" />

            <h1 class="text-display-lg text-center mb-8">
                {{ title }}
            </h1>

            <slot />
        </div>
    </div>
</template>

<script>
import NavBar from "#app/layouts/navbar/navbar.vue";

export default {
    components: {
        NavBar
    },
    props: {
        title: {
            type: String,
            required: true
        }
    }
};
</script>
