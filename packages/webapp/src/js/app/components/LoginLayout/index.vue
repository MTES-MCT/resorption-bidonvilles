<template>
    <div>
        <LoginNavBar />

        <div class="container px-10 mx-auto mb-4">
            <div class="max-w-sm mx-auto py-10">
                <div class="text-center mb-8">
                    <img class="h-24" :src="town" />
                </div>

                <h1 class="text-display-lg text-center mb-8">
                    {{ title }}
                </h1>

                <slot />
            </div>
            <Button
                variant="primaryText"
                icon="chevron-left"
                href="/landing"
                iconPosition="left"
                >Aller à la page d'accueil</Button
            >
        </div>
    </div>
</template>

<script>
import town from "#src/img/town.png";
import LoginNavBar from "./LoginNavBar/index.vue";

export default {
    components: {
        LoginNavBar
    },
    props: {
        title: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            town
        };
    }
};
</script>
