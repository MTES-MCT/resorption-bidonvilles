<template>
    <Modal :isOpen="isOpen" :closeModal="closeModal" class="modalContainer">
        <template v-slot:title>
            <div>Inviter un intervenant</div>
        </template>

        <template v-slot:body>
            <ValidationObserver ref="form" @submit.prevent="submit">
                <form>
                    <div class="w-128 -mx-4 -mt-8 p-4">
                        <p class="mb-4">
                            <span class="font-bold"
                                >L'intervenant n'est pas présent dans cette
                                liste ?</span
                            >
                            Invitez le
                        </p>

                        <TextInput
                            id="email"
                            label="Courriel"
                            v-model="form.email"
                        ></TextInput>
                    </div>

                    <p
                        class="bg-red200 p-6 mb-6 font-bold"
                        v-if="error !== null"
                    >
                        {{ error }}
                    </p>

                    <div class="flex justify-end mt-2">
                        <Button
                            variant="primaryText"
                            class="mr-8"
                            @click="closeModal"
                            type="button"
                            >Annuler</Button
                        >
                        <Button
                            variant="tertiary"
                            type="primary"
                            :loading="loading"
                            >Valider</Button
                        >
                    </div>
                </form>
            </ValidationObserver>
        </template>
    </Modal>
</template>

<script>
import { notify } from "#helpers/notificationHelper";

export default {
    props: {
        townId: {
            type: Number,
            required: true
        },
        isOpen: {
            type: Boolean,
            required: false,
            default: false
        }
    },

    data() {
        return {
            loading: false,
            error: null,
            form: {
                email: ""
            }
        };
    },

    methods: {
        closeModal() {
            this.$emit("closeModal");
        },

        async submit() {
            if (this.loading) {
                return;
            }

            this.loading = true;
            this.error = null;
            this.$refs.form.reset();

            try {
                await this.$store.dispatch("inviteNewTownActor", {
                    townId: this.townId,
                    email: this.form.email
                });
                this.form.email = "";

                notify({
                    group: "notifications",
                    type: "success",
                    title: "Succès",
                    text: "L'invitation a bien été envoyée"
                });

                this.closeModal();
            } catch (error) {
                if (error && error.fields) {
                    this.$refs.form.setErrors(error.fields);
                }

                this.error =
                    (error && error.user_message) ||
                    "Une erreur inconnue est survenue";
            }

            this.loading = false;
        }
    }
};
</script>
