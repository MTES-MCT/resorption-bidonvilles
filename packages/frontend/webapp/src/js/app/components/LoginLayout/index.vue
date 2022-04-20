<template>
    <div>
        <LoginNavBar />

        <div class="container px-10 mx-auto mb-4">
            <div class="max-w-sm mx-auto py-10">
                <div class="text-center mb-8">
                    <img class="h-24" :src="town" />
                </div>

                <h1 class="text-display-lg font-bold text-center mb-8">
                    {{ title }}
                </h1>

                <slot />
            </div>

            <Button
                variant="primaryText"
                icon="chevron-left"
                :href="backHref"
                iconPosition="left"
                >{{ backWording }}</Button
            >
        </div>
    </div>
</template>

<script>
import { VUE_APP_WWW_URL } from "#src/js/env.js";
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
        },
        backTo: {
            type: String, // either "home" (default) or "www"
            required: true,
            default: "home"
        }
    },
    data() {
        return {
            town
        };
    },
    computed: {
        backHref() {
            if (this.backTo === "home") {
                return "/";
            }

            return `${VUE_APP_WWW_URL}/`;
        },
        backWording() {
            if (this.backTo === "home") {
                return "Revenir au formulaire de connexion";
            }

            return `Aller à la page d'accueil`;
        }
    }
};
</script>
