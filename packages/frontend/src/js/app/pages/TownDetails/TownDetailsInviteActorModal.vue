<template>
    <Modal :isOpen="isOpen" :closeModal="closeModal" class="modalContainer">
        <template v-slot:title>
            <div>Inviter un intervenant</div>
        </template>

        <template v-slot:body>
            <ValidationObserver ref="form" @submit.prevent="submit">
                <form>
                    <p class="-mt-6">
                        Favorisez la synergie entre les acteurs en invitant un
                        intervenant, un courriel lui sera envoyé.
                    </p>
                    <div class="mt-4">
                        <p>
                            <span class="font-bold"
                                >L'intervenant est-il un utilisateur de la
                                plateforme Résorption-bidonvilles ?</span
                            ><br />
                            Cherchez le nom de la personne en tapant au minimum
                            les premières lettre de son nom ou prénom
                        </p>

                        <div class="w-128">
                            <AutocompleteV2
                                id="user_id"
                                label=""
                                prefixIcon="user"
                                :search="autocomplete"
                                :loading="searching"
                                :getResultValue="getResultValue"
                                v-model="form.user"
                                ref="autocomplete"
                            ></AutocompleteV2>
                        </div>
                    </div>

                    <div class="w-128">
                        <p class="mb-2">
                            <span class="font-bold"
                                >L'intervenant n'est pas présent dans cette
                                liste ?</span
                            ><br />Saisissez son courriel pour l'inviter
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
import { findRelations } from "#helpers/api/town";

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
            searching: false,
            error: null,
            form: {
                user: null,
                email: ""
            }
        };
    },

    computed: {
        successWording() {
            if (this.form.user && this.form.user.id) {
                return "L'intervenant a bien été notifié par courriel";
            }

            return "L'invitation a bien été envoyée";
        }
    },

    methods: {
        closeModal() {
            this.resetForm();
            this.$emit("closeModal");
        },

        resetForm() {
            this.error = null;
            this.$refs.form.reset();
            this.$refs.autocomplete.removeItem();
            this.form.email = "";
        },

        async autocomplete(query) {
            if (!query || query.length < 3) {
                return Promise.resolve([]);
            }

            this.searching = true;
            const { relations } = await findRelations(this.townId, query);
            this.searching = false;

            return relations;
        },

        getResultValue(user) {
            if (!user || !user.first_name) {
                return "";
            }

            return `${user.first_name} ${user.last_name.toUpperCase()} - ${user
                .organization.abbreviation || user.organization.name}`;
        },

        async submit() {
            if (this.loading) {
                return;
            }

            this.loading = true;
            this.error = null;
            this.$refs.form.reset();

            try {
                await this.dispatch();

                notify({
                    group: "notifications",
                    type: "success",
                    title: "Succès",
                    text: this.successWording
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
        },

        dispatch() {
            if (this.form.user && this.form.user.id) {
                this.$trackMatomoEvent(
                    "Intervenant",
                    "Déclaration intervenant",
                    this.townId
                );
                return this.$store.dispatch("addTownActor", {
                    townId: this.townId,
                    actor: {
                        user_id: this.form.user.id
                    }
                });
            }

            this.$trackMatomoEvent(
                "Intervenant",
                "Invitation intevernant",
                this.townId
            );
            return this.$store.dispatch("inviteNewTownActor", {
                townId: this.townId,
                email: this.form.email
            });
        }
    }
};
</script>
