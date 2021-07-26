<template>
    <Modal :isOpen="isOpen" :closeModal="onClose">
        <template v-slot:title>
            Confirmez-vous la suppression du message ?
        </template>

        <template v-slot:body>
            <CommentBlock
                :comment="activity.comment"
                class="bg-G100 p-6 border"
            />
            <div class="mt-6">
                <TextArea
                    :disabled="loading"
                    label="Pourquoi souhaitez-vous supprimer ce message ?"
                    v-model="reason"
                />
            </div>
            <div class="error text-error" v-if="error">{{ error }}</div>
        </template>

        <template v-slot:footer>
            <Button variant="primaryText" @click="isOpen = false"
                >Annuler</Button
            >
            <Button
                class="ml-5"
                variant="tertiary"
                :loading="loading"
                @click="remove"
                >Supprimer</Button
            >
        </template>
    </Modal>
</template>

<script>
import CommentBlock from "#app/pages/TownDetails/ui/CommentBlock.vue";
import { notify } from "#helpers/notificationHelper";
import { deleteComment } from "#helpers/api/town";
import store from "#app/store";

export default {
    components: {
        CommentBlock
    },

    props: {
        activity: {
            type: Object,
            required: true
        }
    },

    data() {
        return {
            loading: false,
            isOpen: false,
            error: null,
            reason: ""
        };
    },

    methods: {
        open() {
            this.isOpen = true;
        },
        onClose() {
            this.isOpen = false;
        },
        async remove() {
            if (this.loading === true) {
                return;
            }

            this.loading = true;
            this.error = null;
            console.log(this.activity.comment);
            try {
                await deleteComment(
                    this.activity.comment.shantytown,
                    this.activity.comment.id,
                    this.reason
                );

                this.reason = "";
                this.isOpen = false;

                notify({
                    group: "notifications",
                    type: "success",
                    title: "Message supprimé",
                    text: "L'auteur du message en a été notifié par email"
                });

                store.commit("removeComment", this.activity.comment.id);
            } catch (error) {
                this.error =
                    (error && error.user_message) ||
                    "Une erreur inconnue est survenue";
            }

            this.loading = false;
        }
    }
};
</script>
