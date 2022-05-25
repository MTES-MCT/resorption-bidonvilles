<template>
    <SidePanel
        :isOpen="isOpen"
        :closePanel="closePanel"
        :closeClickOutside="true"
    >
        <div class="scrollablePanel">
            <div class="  px-8 ">
                <div class="border-b-2 border-G200 py-4">
                    <div class="flex justify-end">
                        <Button
                            variant="primaryText"
                            icon="times"
                            size="lg"
                            @click="closePanel"
                        />
                    </div>

                    <div class="flex items-center text-primary">
                        <Icon icon="comment" class="mr-2 " />
                        <div class="text-display-md font-bold text-primary">
                            Commentaire Covid-19
                        </div>
                    </div>
                </div>

                <div class="text-G600 italic my-6">
                    Merci de préciser votre action, ses modalités, et le
                    nombrede personnes avec des symptômes.Merci de respecter les
                    règles de confidentialité. Ne pas citer l’identité des
                    individus (Nom, âge, sexe, origine...)
                </div>

                <ValidationObserver ref="form" v-slot="{ handleSubmit }">
                    <form
                        @submit.prevent="handleSubmit(addCovidComment)"
                        ref="form"
                    >
                        <DatepickerV2
                            class="w-64"
                            label="Date de votre intervention"
                            id="closed_at"
                            validationName="Date"
                            :disabled-dates="{ from: new Date() }"
                            :language="dateLanguage"
                            :monday-first="true"
                            :full-month-name="true"
                            :format="'dd MMMM yyyy'"
                            v-model="form.date"
                            rules="required"
                        />

                        <CheckableGroup label="Préciser votre intervention">
                            <Checkbox
                                checkValue="action_mediation_sante"
                                label="Action de médiation en santé"
                                v-model="form.interventionType"
                            />
                            <Checkbox
                                checkValue="sensibilisation_vaccination"
                                label="Sensibilisation à la vaccination"
                                v-model="form.interventionType"
                            />
                            <Checkbox
                                checkValue="equipe_mobile_depistage"
                                label="Équipe mobile de dépistage"
                                v-model="form.interventionType"
                            />
                            <Checkbox
                                checkValue="equipe_mobile_vaccination"
                                label="Équipe mobile de vaccination"
                                v-model="form.interventionType"
                            />
                        </CheckableGroup>

                        <CheckableGroup label="Signaler si nécessaire">
                            <Checkbox
                                checkValue="personnes_orientees"
                                label="Personne(s) orientée(s) vers un centre d'hébergement"
                                v-model="form.interventionType"
                            />
                            <Checkbox
                                checkValue="personnes_avec_symptomes"
                                label="Personne(s) avec des symptômes Covid-19"
                                v-model="form.interventionType"
                            />
                            <Checkbox
                                checkValue="besoin_action"
                                label="Besoin d'une action prioritaire"
                                v-model="form.interventionType"
                            />
                        </CheckableGroup>

                        <TextArea
                            label="Ecrire un message"
                            rows="10"
                            name="newComment"
                            v-model="form.newComment"
                            rules="required"
                            validationName="Ecrire un message"
                            placeholder="Partagez votre passage sur le site, le contexte sanitaire, la situation des habitants, difficultés rencontrées lors de votre intervention…"
                            :showMandatoryStar="true"
                            :disabled="loading"
                        />
                        <div class="flex items-center justify-between">
                            <p>
                                <Button
                                    variant="primaryText"
                                    type="button"
                                    v-if="form.newComment"
                                    @click="cancelComment"
                                    >Annuler</Button
                                >
                            </p>
                            <Button
                                variant="tertiary"
                                type="primary"
                                :loading="loading"
                                >Valider</Button
                            >
                        </div>
                    </form>
                </ValidationObserver>
            </div>
            <div class="bg-orange200 px-8 py-4 mt-4">
                <div class="font-bold mb-4">
                    {{ this.town.comments.covid.length }}
                    {{
                        this.town.comments.covid.length > 1
                            ? "commentaires"
                            : "commentaire"
                    }}
                </div>
                <CommentBlock
                    v-for="comment in sortedComments"
                    :key="comment.id"
                    :comment="comment"
                />
            </div>
        </div>
    </SidePanel>
</template>

<script>
import { fr } from "vuejs-datepicker/dist/locale";
import CheckableGroup from "#app/components/ui/Form/CheckableGroup";
import CommentBlock from "#app/components/CommentBlock/CommentBlock.vue";

export default {
    components: { CommentBlock, CheckableGroup },
    props: {
        town: {
            type: Object
        },
        isOpen: {
            type: Boolean
        },
        closePanel: {
            type: Function
        }
    },
    data() {
        return {
            dateLanguage: fr,
            loading: false,
            form: {
                date: new Date(),
                interventionType: [],
                newComment: ""
            }
        };
    },
    computed: {
        sortedComments() {
            const comments = [...this.town.comments.covid];
            return comments.sort((a, b) => {
                return b.createdAt - a.createdAt;
            });
        }
    },
    methods: {
        /**
         * @see index.js
         */
        formatDate(...args) {
            return window.App.formatDate.apply(window, args);
        },
        cancelComment() {
            this.form.newComment = "";
            this.$nextTick(() => {
                this.$refs.form.reset();
            });
        },
        async addCovidComment() {
            if (this.loading === true) {
                return;
            }

            // clean previous errors
            this.covidErrors = [];
            this.loading = true;

            try {
                await this.$store.dispatch(
                    "shantytownComments/publishCovidComment",
                    {
                        townId: parseInt(this.$route.params.id, 10),
                        comment: {
                            date: this.form.date,
                            description: this.form.newComment,
                            action_mediation_sante: this.form.interventionType.includes(
                                "action_mediation_sante"
                            ),
                            equipe_mobile_depistage: this.form.interventionType.includes(
                                "equipe_mobile_depistage"
                            ),
                            equipe_mobile_vaccination: this.form.interventionType.includes(
                                "equipe_mobile_vaccination"
                            ),
                            sensibilisation_vaccination: this.form.interventionType.includes(
                                "sensibilisation_vaccination"
                            ),
                            personnes_orientees: this.form.interventionType.includes(
                                "personnes_orientees"
                            ),
                            personnes_avec_symptomes: this.form.interventionType.includes(
                                "personnes_avec_symptomes"
                            ),
                            besoin_action: this.form.interventionType.includes(
                                "besoin_action"
                            )
                        }
                    }
                );

                this.form = {
                    newComment: "",
                    date: new Date(),
                    interventionType: []
                };
                this.$nextTick(() => {
                    this.$refs.form.reset();
                });
            } catch (error) {
                const fields = error.fields || {};
                this.covidErrors = Object.keys(fields).reduce(
                    (acc, key) => [...acc, ...fields[key]],
                    []
                );
            }

            this.loading = false;
        }
    }
};
</script>
