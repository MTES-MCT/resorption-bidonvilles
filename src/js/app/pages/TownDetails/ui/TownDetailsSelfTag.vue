<template>
    <div
        class="bg-white inline-block border border-primary text-primary px-3 mr-2 mb-2 rounded-lg"
    >
        <slot />
        <span class="ml-2 align-middle">
            <Icon
                v-if="!loading"
                class="cursor-pointer"
                icon="times"
                @click.native="remove"
            />
            <Icon v-else icon="spinner" spin />
        </span>
    </div>
</template>

<script>
import { notify } from "#helpers/notificationHelper";

export default {
    props: {
        townId: {
            type: Number,
            required: true
        },
        userId: {
            type: Number,
            required: true
        },
        themeId: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            loading: false
        };
    },
    methods: {
        async remove() {
            if (this.loading === true) {
                return;
            }

            this.loading = true;

            try {
                await this.$store.dispatch("removeTownActorTheme", {
                    townId: this.townId,
                    userId: this.userId,
                    themeId: this.themeId
                });

                notify({
                    group: "notifications",
                    type: "success",
                    title: "Succès",
                    text: "Champ d'intervention retiré"
                });
            } catch (error) {
                notify({
                    group: "notifications",
                    type: "error",
                    title: "Échec",
                    text:
                        (error && error.user_message) ||
                        "Une erreur inconnue est survenue"
                });
            }

            this.loading = false;
        }
    }
};
</script>
