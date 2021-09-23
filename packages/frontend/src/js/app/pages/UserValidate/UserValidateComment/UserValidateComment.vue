<template>
    <div v-if="state === 'loaded' && user" class="bg-G100 p-4 customShadow">
        <TextArea
            rows="5"
            label="Commentaire"
            info="(champ réservé aux administrateurs nationaux)"
            name="adminComment"
            v-model="adminComment"
            placeholder="Votre commentaire..."
        />
        <div class="flex items-center justify-between">
            <Button variant="primaryText" @click="cancelComment"
                >Annuler</Button
            >
            <Button variant="tertiary" @click="addComment" :loading="loading"
                >Valider</Button
            >
        </div>
    </div>
    <div class="text-red" v-else-if="state === 'error'">
        <p class="font-bold">Erreur</p>
        <p>{{ commentError }}</p>
    </div>
</template>
<script>
import { comment as apiComment } from "#helpers/api/user";

export default {
    data() {
        return {
            commentError: null,
            commentErrors: {},
            adminComment: this.user.admin_comments,
            loading: false,
            /**
             * The current state of the page
             *
             * One out of: 'loading', 'error', or 'loaded'
             *
             * @type {string|null}
             */
            state: "loaded"
        };
    },
    props: {
        user: {
            type: Object
        }
    },
    methods: {
        cancelComment() {
            this.adminComment = this.user.admin_comments;
        },
        async addComment() {
            // clean previous errors
            this.commentError = null;
            this.commentErrors = {};
            this.loading = true;

            try {
                const response = await apiComment(
                    this.user.id,
                    this.adminComment
                );
                // Met à jour la valeur affichée dans le champ
                this.adminComment = response.adminComment;
            } catch (response) {
                if (
                    response.user_message === null ||
                    response.user_message.length < 1
                ) {
                    this.commentError =
                        "Une erreur est survenue lors de la mise à jour du comentaire";
                    this.commentErrors = {};
                } else {
                    this.commentError = response.user_message;
                    this.commentErrors = response.fields || {};
                }
                this.state = "error";
            }
            this.loading = false;
        }
    }
};
</script>
