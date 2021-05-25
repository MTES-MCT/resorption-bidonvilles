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
                        <div class="text-display-md text-primary">
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
                    <form @submit.prevent="handleSubmit(addCovidComment)">
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
                                checkValue="equipe_maraude"
                                label="Équipe de maraude"
                                v-model="form.interventionType"
                            />
                            <Checkbox
                                checkValue="equipe_sanitaire"
                                label="Équipe sanitaire"
                                v-model="form.interventionType"
                            />
                            <Checkbox
                                checkValue="equipe_accompagnement"
                                label="Équipe d'accompagnement"
                                v-model="form.interventionType"
                            />
                            <Checkbox
                                checkValue="distribution_alimentaire"
                                label="Distribution d'aide alimentaire"
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
                        />
                        <div class="flex items-center justify-between">
                            <Button
                                variant="primaryText"
                                type="button"
                                @click="cancelComment"
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
            </div>
            <div class="bg-orange200 px-8 py-4 mt-4">
                <div class="font-bold mb-4">
                    {{ this.town.comments.covid.length }} commentaires
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
import { addCovidComment } from "#helpers/api/town";
import CommentBlock from "#app/pages/TownDetails/ui/CommentBlock";

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
        },
        addCovidComment() {
            if (this.loading) {
                return;
            }

            // clean previous errors
            this.covidErrors = [];
            this.loading = true;

            addCovidComment(this.$route.params.id, {
                date: this.form.date,
                description: this.form.newComment,
                equipe_maraude: this.form.interventionType.includes(
                    "equipe_maraude"
                ),
                equipe_sanitaire: this.form.interventionType.includes(
                    "equipe_sanitaire"
                ),
                equipe_accompagnement: this.form.interventionType.includes(
                    "equipe_accompagnement"
                ),
                distribution_alimentaire: this.form.interventionType.includes(
                    "distribution_alimentaire"
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
            })
                .then(response => {
                    this.$piwik?.trackEvent(
                        "Commentaire",
                        "Création commentaire Covid",
                        this.town.id
                    );

                    this.$emit("updateTown", {
                        ...this.town,
                        comments: {
                            ...this.town.comments,
                            covid: response
                        }
                    });

                    this.form = {
                        newComment: "",
                        date: new Date(),
                        interventionType: []
                    };
                    this.loading = false;
                })
                .catch(response => {
                    const fields = response.fields || {};
                    this.loading = false;
                    this.covidErrors = Object.keys(fields).reduce(
                        (acc, key) => [...acc, ...fields[key]],
                        []
                    );
                });
        }
    }
};
</script>
