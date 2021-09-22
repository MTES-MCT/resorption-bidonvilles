<template>
    <div class="bg-g100 p-4 customShadow">
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
</template>
<script>
import { comment as apiComment } from "#helpers/api/user";

export default {
    data() {
        return {
            commentError: null,
            commentErrors: {},
            adminComment: this.user.admin_comments,
            loading: false
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
                this.adminComment = response.adminComment;
            } catch (response) {
                this.commentError = response.user_message;
                this.commentErrors = response.fields || {};
            }
            this.loading = false;
        }
    }
};
</script>
