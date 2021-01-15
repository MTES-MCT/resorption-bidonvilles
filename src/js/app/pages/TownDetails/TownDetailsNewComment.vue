<template>
    <div>
        <div class="text-display-lg text-corail py-6">
            <Icon icon="comment" /> Écrire un message
        </div>
        <div class="bg-white p-6">
            <div class="mb-4"><Icon icon="user" /> {{ user.first_name }}</div>
            <TextArea
                rows="10"
                name="newComment"
                v-model="newComment"
                placeholder="Votre message - Merci de respecter les règles de confidentialité."
            />
            <div class="flex items-center justify-between">
                <Button variant="primaryText" @click="cancelComment"
                    >Annuler</Button
                >
                <Button variant="tertiary" @click="addComment">Valider</Button>
            </div>
        </div>
    </div>
</template>

<script>
import { hasPermission } from "#helpers/api/config";
import { addComment as apiAddComment } from "#helpers/api/town";

export default {
    data() {
        return {
            commentError: null,
            commentErrors: {},
            newComment: ""
        };
    },
    props: {
        user: {
            type: Object
        }
    },
    methods: {
        cancelComment() {
            this.newComment = "";
        },
        addComment() {
            if (!hasPermission("shantytown_comment.create")) {
                return;
            }

            // clean previous errors
            this.commentError = null;
            this.commentErrors = {};

            apiAddComment(this.$route.params.id, {
                description: this.newComment
            })
                .then(response => {
                    this.$emit("submit", response.comments);
                    this.newComment = "";
                })
                .catch(response => {
                    this.commentError = response.user_message;
                    this.commentErrors = response.fields || {};
                });
        }
    }
};
</script>
