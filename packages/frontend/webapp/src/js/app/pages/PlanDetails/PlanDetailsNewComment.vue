<template>
    <div>
        <div class="text-display-lg font-bold text-corail">
            <Icon icon="comment" /> LE JOURNAL DE L'ACTION
            <span
                >- {{ nbComments }} message{{ nbComments > 1 ? "s" : "" }}</span
            >
        </div>
        <div class="text-display-md font-bold pt-6 pb-4">
            Partager une info
        </div>
        <div
            class="bg-white p-6 customShadow"
            v-if="$store.getters['config/hasPermission']('plan_comment.create')"
        >
            <div class="mb-4">
                <Icon icon="user" /> {{ user.first_name }} {{ user.last_name }}
            </div>
            <TextArea
                rows="5"
                name="newComment"
                :disabled="loading"
                v-model="newComment"
                placeholder="Partagez vos infos concernant l'action"
            />

            <div
                v-if="commentError !== null"
                class="text-red border border-red py-2 px-4 mb-4"
            >
                {{ commentError }}
                <ul v-if="commentErrors.length" class="text-sm">
                    <li v-for="(error, index) in commentErrors" :key="index">
                        - {{ error }}
                    </li>
                </ul>
            </div>

            <div class="flex items-center justify-between">
                <p>
                    <Button
                        variant="primaryText"
                        @click="cancelComment"
                        v-if="newComment"
                        >Annuler</Button
                    >
                </p>
                <Button
                    variant="tertiary"
                    @click="addComment"
                    :loading="loading"
                    >Valider</Button
                >
            </div>
        </div>
        <div v-else>
            Vous n'avez pas la permission de publier un message sur cette action
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            commentError: null,
            commentErrors: [],
            newComment: "",
            mode: "public",
            loading: false
        };
    },
    props: {
        nbComments: {
            type: Number
        },
        departementCode: {
            type: String
        }
    },
    computed: {
        user() {
            return this.$store.state.config.configuration.user;
        }
    },
    methods: {
        cancelComment() {
            this.newComment = "";
            this.commentError = null;
            this.commentErrors = [];
        },
        async addComment() {
            if (this.loading === true) {
                return;
            }

            // clean previous errors
            this.commentError = null;
            this.commentErrors = [];
            this.loading = true;

            try {
                await this.$store.dispatch("planComments/publishComment", {
                    planId: parseInt(this.$route.params.id, 10),
                    comment: {
                        description: this.newComment
                    }
                });
                this.newComment = "";
            } catch (response) {
                this.commentError = response.user_message;
                this.commentErrors = response.fields
                    ? Object.values(response.fields).flat()
                    : [];
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
