<template>
    <Modal :isOpen="isOpen" :closeModal="closeModal" class="modalContainer">
        <template v-slot:title>
            <div>Confirmez-vous la fermeture du dispositif ?</div>
        </template>
        <template v-slot:body>
            <ValidationObserver ref="form" v-slot="{ handleSubmit, errors }">
                <form @submit.prevent="handleSubmit(submit)">
                    <div class="scrollableContainer -mx-4 -mt-8 p-4">
                        <FormErrorLog
                            :mainError="error"
                            :errors="errors"
                            class="mb-4"
                            :linksToErrors="false"
                        />

                        <div v-if="step === 1">
                            <p>
                                Avant de fermer définitivement le dispositif,
                                assurez-vous que les indicateurs de suivi
                                renseignés par l'opérateur sont à jour.
                                <span v-if="plan.last_update !== null"
                                    >Pour information, la dernière mise à jour
                                    des indicateurs a eu lieu le
                                    {{
                                        formatDate(
                                            plan.last_update / 1000,
                                            "d/m/y"
                                        )
                                    }}.</span
                                >
                            </p>
                            <p class="mt-2">
                                Merci de renseigner les dépenses exécutées de
                                l'année en cours et des années précédentes si
                                nécessaire :
                            </p>

                            <InputFinances
                                v-model="form.finances"
                                realAmount="all"
                                id="finances"
                                validationName="Financements"
                            ></InputFinances>
                        </div>

                        <div v-else>
                            <DatepickerV2
                                width="w-64"
                                id="closedAt"
                                label="Date de fermeture du dispositif"
                                info="La date de fermeture du dispositif doit être postérieure - ou égale - à la dernière date de mise à jour des indicateurs."
                                v-model="form.closedAt"
                                :showMandatoryStar="true"
                                rules="required"
                                :disabled-dates="{
                                    to: new Date(plan.last_update),
                                    from: new Date()
                                }"
                                validationName="Date de fermeture du dispositif"
                            />
                            <TextArea
                                rows="5"
                                id="comment"
                                name="comment"
                                v-model="form.comment"
                                label="Commentaire"
                                :info="info"
                                validationName="Commentaire"
                            />
                        </div>
                    </div>

                    <div class="flex justify-between mt-8">
                        <div>
                            <Button
                                v-if="step > 1"
                                variant="tertiary"
                                type="button"
                                @click="previousStep()"
                                :disabled="loading || step === 1"
                                >Précédent</Button
                            >
                        </div>
                        <div>
                            <Button
                                variant="primaryText"
                                class="mr-8"
                                @click="closeModal"
                                type="button"
                                >Annuler</Button
                            >
                            <Button
                                v-if="step === 1"
                                variant="tertiary"
                                type="button"
                                @click.native="nextStep"
                                >Suite</Button
                            >
                            <Button
                                v-else
                                variant="primary"
                                type="submit"
                                :loading="loading"
                                >Valider</Button
                            >
                        </div>
                    </div>
                </form>
            </ValidationObserver>
        </template>
    </Modal>
</template>

<script>
import { close } from "#helpers/api/plan";
import { notify } from "#helpers/notificationHelper";
import InputFinances from "#app/components/InputFinances/InputFinances.vue";
import FormErrorLog from "#app/components/ui/Form/FormErrorLog";

export default {
    props: {
        isOpen: {
            type: Boolean,
            required: false,
            default: false
        },
        plan: {
            type: Object,
            required: true
        },
        audience: {
            type: Object
        }
    },

    components: {
        FormErrorLog,
        InputFinances
    },

    data() {
        return {
            loading: false,
            error: null,
            form: this.emptyData(),
            step: 1
        };
    },

    computed: {
        info() {
            if (!this.audience) {
                return "";
            }

            const remainingAudience = { ...this.audience.in };
            ["out_positive", "out_abandoned", "out_excluded"].forEach(key => {
                remainingAudience.total -= this.audience[key].total;
                remainingAudience.families -= this.audience[key].families;
                remainingAudience.women -= this.audience[key].women;
                remainingAudience.minors -= this.audience[key].minors;
            });

            if (
                remainingAudience.total === 0 &&
                remainingAudience.families === 0 &&
                remainingAudience.women === 0 &&
                remainingAudience.minors === 0
            ) {
                return "Précisez les raisons de la fermeture du dispositif";
            }

            return `À la fermeture du dispositif, ${
                remainingAudience.families
            } ménage${
                remainingAudience.families > 1 ? "s" : ""
            } (pour un total de ${remainingAudience.total} personne${
                remainingAudience.total > 1 ? "s" : ""
            }) sont identifiés dans le dispositif. Merci de préciser les solutions mobilisées pour ces personnes et les raisons de la fermeture du dispositif. Merci de respecter les règles de confidentialité : ne pas citer l'identité des individus (Nom, âge, sexe, origine...)`;
        }
    },

    methods: {
        formatDate(...args) {
            return App.formatDate(...args);
        },
        closeModal() {
            this.$emit("closeModal");
            this.form = this.emptyData();
            this.step = 1;
            this.$nextTick(() => {
                this.$refs.form.reset();
            });
        },
        emptyData() {
            return {
                finances: this.plan.finances
                    ? this.plan.finances.map(finances => {
                          return {
                              ...finances,
                              data: finances.data.map(row => ({
                                  ...row,
                                  type: row.type.uid
                              }))
                          };
                      })
                    : [],
                closedAt: null,
                comment: ""
            };
        },
        nextStep(event) {
            event.preventDefault();
            this.step = 2;
        },
        previousStep() {
            this.step = 1;
        },
        async submit() {
            if (this.loading === true || this.step === 1) {
                return;
            }

            const isValid = await this.$refs.form.validate();
            if (!isValid) {
                return;
            }

            this.loading = true;
            this.error = null;

            try {
                await close(this.plan.id, {
                    ...this.form
                });

                this.loading = false;
                this.$trackMatomoEvent(
                    "Dispositif",
                    "Fermeture dispositif",
                    `D${this.plan.id}`
                );

                this.closeModal();

                notify({
                    group: "notifications",
                    type: "success",
                    title: "Dispositif fermé",
                    text: "Le dispositif a bien été fermé"
                });

                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } catch (err) {
                this.loading = false;
                this.error =
                    (err && err.user_message) ||
                    "Une erreur inconnue est survenue";
                if (err.fields) {
                    console.log(err.fields);
                    this.$refs.form.setErrors(err.fields);
                }
            }
        }
    }
};
</script>

<style>
.modalContainer {
    z-index: 1000;
}
.scrollableContainer {
    max-height: 60vh;
    max-width: 800px;
    overflow-y: auto;
}
</style>
