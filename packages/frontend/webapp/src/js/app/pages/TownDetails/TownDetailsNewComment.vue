<template>
    <div>
        <div class="text-display-lg font-bold text-corail">
            <Icon icon="comment" /> LE JOURNAL DU SITE
            <span
                >- {{ nbComments }} message{{ nbComments > 1 ? "s" : "" }}</span
            >
        </div>
        <div class="text-display-md font-bold pt-6 pb-4">
            Partager une info
        </div>
        <div class="bg-white p-6 customShadow">
            <div class="mb-4">
                <Icon icon="user" /> {{ user.first_name }} {{ user.last_name }}
            </div>
            <TextArea
                rows="5"
                name="newComment"
                v-model="newComment"
                placeholder="Partagez votre passage sur le site, le contexte sanitaire, la situation des habitants, difficultés rencontrées lors de votre intervention…"
            />
            <div
                class="flex ml-4"
                v-if="
                    $store.getters['config/hasPermission'](
                        'shantytown_comment.createPrivate'
                    )
                "
            >
                <div class="text-sm mr-4">
                    <Icon icon="lock" class="text-red" />
                    Je souhaite réserver ce message à mes collègues en
                    Préfecture et DDETS
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
                <Button
                    variant="tertiary"
                    @click="addComment"
                    :loading="loading"
                    >Valider</Button
                >
            </div>
        </div>
    </div>
</template>

<script>
import { addComment as apiAddComment } from "#helpers/api/town";

export default {
    data() {
        return {
            commentError: null,
            commentErrors: {},
            newComment: "",
            isPrivate: false,
            loading: false
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
        cancelComment() {
            this.newComment = "";
        },
        async addComment() {
            // clean previous errors
            this.commentError = null;
            this.commentErrors = {};
            this.loading = true;

            try {
                const response = await apiAddComment(this.$route.params.id, {
                    description: this.newComment,
                    private: this.isPrivate
                });
                this.$emit("submit", response.comments);
                this.newComment = "";
            } catch (response) {
                this.commentError = response.user_message;
                this.commentErrors = response.fields || {};
            }
            this.loading = false;
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
