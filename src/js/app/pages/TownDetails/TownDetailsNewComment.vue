<template>
    <div>
        <div class="text-display-lg text-corail">
            <Icon icon="comment" /> LE JOURNAL DU SITE
            <span
                >- {{ nbComments }} message{{ nbComments > 1 ? "s" : "" }}</span
            >
        </div>
        <div class="text-display-md pt-6 pb-4">
            Partager une info
        </div>
        <div class="bg-white p-6 customShadow">
            <div class="mb-4"><Icon icon="user" /> {{ user.first_name }}</div>
            <TextArea
                rows="5"
                name="newComment"
                v-model="newComment"
                placeholder="Votre commentaire - Merci de respecter les règles de confidentialité."
            />
            <div
                class="flex ml-4"
                v-if="hasPermission('shantytown_comment.createPrivate')"
            >
                <div class="text-sm mr-4">
                    <Icon icon="lock" class="text-red" />
                    Je souhaite réserver ce message à mes collègues en
                    Préfecture et DDCS
                </div>
                <CheckableGroup direction="horizontal" id="private_comments">
                    <Radio
                        label="Oui"
                        v-model="isPrivate"
                        :checkValue="true"
                        cypressName="private_comments"
                    ></Radio>
                    <Radio
                        label="Non"
                        v-model="isPrivate"
                        :checkValue="false"
                        cypressName="private_comments"
                    ></Radio>
                </CheckableGroup>
            </div>
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
import { addComment as apiAddComment } from "#helpers/api/town";
import { hasPermission } from "#helpers/api/config";

export default {
    data() {
        return {
            commentError: null,
            commentErrors: {},
            newComment: "",
            isPrivate: false
        };
    },
    props: {
        nbComments: {
            type: Number
        },
        user: {
            type: Object
        }
    },
    methods: {
        hasPermission,
        cancelComment() {
            this.newComment = "";
        },
        addComment() {
            // clean previous errors
            this.commentError = null;
            this.commentErrors = {};

            apiAddComment(this.$route.params.id, {
                description: this.newComment,
                private: this.isPrivate
            })
                .then(response => {
                    this.$piwik?.trackEvent(
                        "Commentaire",
                        "Création commentaire",
                        this.town.id
                    );
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

<style scoped>
.customShadow {
    box-shadow: 0 0px 20px 0 rgba(255, 194, 158, 0.3),
        0 0px 0px 0 rgba(0, 0, 0, 0.06);
}
</style>
