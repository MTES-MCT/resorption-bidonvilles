<template>
    <div>
        <div class="bg-G100 p-4 customShadow">
            <TextArea
                rows="5"
                label="Commentaire"
                info="(champ réservé aux administrateurs nationaux)"
                name="adminComment"
                v-model="admin_comments"
                placeholder="Votre commentaire..."
                :disabled="loading"
            />
            <div class="flex items-center justify-between">
                <div>
                    <Button
                        v-if="
                            !loading &&
                                admin_comments !== (user.admin_comments || '')
                        "
                        variant="primaryText"
                        @click="cancelComment"
                        >Annuler mes changements</Button
                    >
                </div>
                <Button
                    variant="tertiary"
                    @click="addComment"
                    :loading="loading"
                    >Valider</Button
                >
            </div>
        </div>

        <div class="text-red" v-if="error">
            <p class="font-bold">Une erreur est survenue :</p>
            <p>{{ error }}</p>
        </div>
    </div>
</template>
<script>
import { setAdminComments } from "#frontend/common/api/user";

export default {
    props: {
        user: {
            type: Object
        }
    },
    data() {
        return {
            admin_comments: this.user.admin_comments || "",
            error: null,
            loading: false
        };
    },
    methods: {
        async addComment() {
            if (this.loading === true) {
                return;
            }

            this.loading = true;
            this.error = null;

            try {
                const { admin_comments } = await setAdminComments(
                    this.user.id,
                    this.admin_comments
                );

                // Met à jour la valeur affichée dans le champ
                // eslint-disable-next-line vue/no-mutating-props
                this.user.admin_comments = admin_comments || "";
                this.admin_comments = admin_comments || "";
            } catch (response) {
                if (!response || !response.user_message) {
                    this.error = "Erreur inconnue";
                } else {
                    this.error = response.user_message;
                }
            }

            this.loading = false;
        },

        cancelComment() {
            if (!this.loading) {
                this.admin_comments = this.user.admin_comments;
            }
        }
    }
};
</script>
