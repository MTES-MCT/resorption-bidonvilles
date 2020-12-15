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

                <div class="text-G600 italic text-sm my-2">
                    Merci de préciser votre action, ses modalités, et le
                    nombrede personnes avec des symptômes.Merci de respecter les
                    règles de confidentialité. Ne pas citer l’identité des
                    individus (Nom, âge, sexe, origine...)
                </div>

                <ValidationObserver ref="form" v-slot="{ handleSubmit }">
                    <form @submit.prevent="handleSubmit(addCovidComment)">
                        <div class="font-bold">Date de votre intervention</div>
                        <DatepickerV2
                            variant="town"
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

                        <div class="font-bold">Préciser votre intervention</div>
                        <CheckableGroup>
                            <Checkbox
                                variant="town"
                                checkValue="equipe_maraude"
                                label="Équipe de maraude"
                                v-model="form.interventionType"
                            />
                            <Checkbox
                                variant="town"
                                checkValue="equipe_sanitaire"
                                label="Équipe sanitaire"
                                v-model="form.interventionType"
                            />
                            <Checkbox
                                variant="town"
                                checkValue="equipe_accompagnement"
                                label="Équipe d'accompagnement"
                                v-model="form.interventionType"
                            />
                            <Checkbox
                                variant="town"
                                checkValue="distribution_alimentaire"
                                label="Distribution d'aide alimentaire"
                                v-model="form.interventionType"
                            />
                        </CheckableGroup>

                        <div class="font-bold">Signaler si nécessaire</div>
                        <CheckableGroup>
                            <Checkbox
                                variant="town"
                                checkValue="personnes_orientees"
                                label="Personne(s) orientée(s) vers un centre d'hébergement"
                                v-model="form.interventionType"
                            />
                            <Checkbox
                                variant="town"
                                checkValue="personnes_avec_symptomes"
                                label="Personne(s) avec des symptômes Covid-19"
                                v-model="form.interventionType"
                            />
                            <Checkbox
                                variant="town"
                                checkValue="besoin_action"
                                label="Besoin d'une action prioritaire"
                                v-model="form.interventionType"
                            />
                        </CheckableGroup>

                        <div class="text-display-sm">Ecrire un commentaire</div>
                        <TextArea
                            rows="10"
                            name="newComment"
                            v-model="form.newComment"
                        />
                        <div class="flex items-center justify-between">
                            <Button
                                variant="primaryText"
                                type="button"
                                @click="cancelComment"
                                >Annuler</Button
                            >
                            <Button variant="primary" @click="addCovidComment"
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
                return a.createdAt - b.createdAt;
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
            this.newComment = "";
        },
        addCovidComment() {
            // clean previous errors
            this.covidErrors = [];

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
                    this.$emit("updateTown", {
                        ...this.town,
                        comments: {
                            ...this.town.comments,
                            covid: response
                        }
                    });

                    this.form = {
                        newComment: "",
                        interventionType: []
                    };
                })
                .catch(response => {
                    const fields = response.fields || {};
                    this.covidErrors = Object.keys(fields).reduce(
                        (acc, key) => [...acc, ...fields[key]],
                        []
                    );
                });
        }
    }
};
</script>

<style>
.scrollablePanel {
    overflow-y: auto;
}
</style>
