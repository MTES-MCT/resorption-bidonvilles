<template>
    <Modal :isOpen="true" :closeModal="closeModal" class="modalContainer">
        <template v-slot:title>
            <div>J'interviens ici</div>
        </template>

        <template v-slot:body>
            <ValidationObserver
                ref="form"
                @submit.prevent="submit"
                v-slot="{ errors }"
            >
                <form>
                    <div class="modalWrapper w-128 -mx-4 -mt-8 p-4">
                        <ValidationProvider vid="user_id"></ValidationProvider>
                        <ValidationProvider vid="themes"></ValidationProvider>

                        <CheckableGroup
                            direction="horizontal"
                            label="Quels sont vos champs d'intervention sur ce site ?"
                            validationName="Champs d'intervention"
                        >
                            <Checkbox
                                v-for="themeId in themeIds"
                                v-bind:key="themeId"
                                variant="card"
                                :label="themes[themeId]"
                                v-model="form.themes"
                                :checkValue="themeId"
                            ></Checkbox>
                        </CheckableGroup>

                        <TextInput
                            label="Autre"
                            v-model="form.autre"
                        ></TextInput>

                        <div class="bg-red200 p-6 mb-6" v-if="error !== null">
                            <strong>{{ error }}</strong>
                            <ul class="mt-4">
                                <li
                                    v-for="(error, inputId) in errors"
                                    :key="inputId"
                                >
                                    {{ error[0] }}
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="flex justify-end mt-8">
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
import { get as getConfig } from "#helpers/api/config";
import { notify } from "#helpers/notificationHelper";

export default {
    props: {
        town: {
            type: Object,
            required: true
        },
        isOpen: {
            type: Boolean
        }
    },

    data() {
        const { actor_themes: themes, user } = getConfig();
        const actor = this.town.actors.find(({ id }) => id === user.id);
        let value = actor !== undefined ? actor.themes : [];
        const autre = value.find(({ id }) => id === "autre");

        return {
            loading: false,
            error: null,
            themes,
            userId: user.id,
            mode: actor === undefined ? "add" : "update",
            form: {
                themes: value.map(({ id }) => id).filter(id => id !== "autre"),
                autre: (autre && autre.value) || ""
            }
        };
    },

    computed: {
        themeIds() {
            return Object.keys(this.themes).filter(id => id !== "autre");
        },

        formattedThemes() {
            const themes = this.form.themes.map(id => ({ id }));
            if (this.form.autre !== "") {
                themes.push({ id: "autre", value: this.form.autre });
            }

            return themes;
        },

        successWording() {
            if (this.mode === "add") {
                return "Vous avez été rajouté à la liste des intervenants";
            }

            return "Vos champs d'intervention ont bien été modifiés";
        }
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
                this.error =
                    (error && error.user_message) ||
                    "Une erreur inconnue est survenue";

                if (error && error.fields) {
                    this.$refs.form.setErrors(error.fields);
                }
            }

            this.loading = false;
        },

        dispatch() {
            if (this.mode === "add") {
                return this.$store.dispatch("addTownActor", {
                    townId: this.town.id,
                    actor: {
                        user_id: this.userId,
                        themes: this.formattedThemes
                    }
                });
            }

            return this.$store.dispatch("updateTownActorThemes", {
                townId: this.town.id,
                userId: this.userId,
                themes: this.formattedThemes
            });
        }
    }
};
</script>

<style scoped>
.modalWrapper {
    min-height: 50vh;
    max-height: 70vh;
    max-width: 800px;
    overflow-y: auto;
}
</style>
