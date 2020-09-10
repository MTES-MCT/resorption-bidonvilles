<template>
    <div>
        <header class="sidepanel-header">
            <h1 class="sidepanel-title"><font-awesome-icon icon="comment"></font-awesome-icon> &nbsp;Commentaires COVID-19</h1>
        </header>

        <div class="sidepanel-content">
            <div class="sidepanel-section">
                <div class="comment-form">
                    <h1>Ajouter un commentaire COVID-19</h1>
                    <p>Merci de préciser votre action, ses modalités, et le nombre de personnes avec des symptômes.</p>
                    <p>Merci de respecter les règles de confidentialité. Ne pas citer l’identité des individus (Nom, âge, sexe, origine...)</p>

                    <p class="covid-header error" v-if="covidErrors.length > 0">
                        <span class="error">Le fomulaire comporte des erreurs :</span>
                    <ul>
                        <li v-for="error in covidErrors">{{ error }}</li>
                    </ul>

                    <div class="covid-header">
                        <label><strong>Date de votre intervention :</strong></label>
                        <datepicker :language="dateLanguage" :monday-first="true" :disabled-dates="{ to: town ? new Date(town.builtAt * 1000) : undefined, from: new Date() }" :full-month-name="true" :format="'dd MMMM yyyy'" v-model="covidComment.date"></datepicker>
                    </div>

                    <p class="covid-header"><strong>Préciser votre intervention :</strong></p>
                    <div class="input__group">
                        <label for="covid-equipeMaraude">
                            <input type="checkbox" id="covid-equipeMaraude" name="covid-equipeMaraude" v-model="covidComment.equipe_maraude" class="input input--checkbox" /> Équipe de maraude
                        </label>
                    </div>

                    <div class="input__group">
                        <label for="covid-equipeSanitaire">
                            <input type="checkbox" id="covid-equipeSanitaire" name="covid-equipeSanitaire" v-model="covidComment.equipe_sanitaire" class="input input--checkbox" /> Équipe sanitaire
                        </label>
                    </div>

                    <div class="input__group">
                        <label for="covid-equipeAccompagnement">
                            <input type="checkbox" id="covid-equipeAccompagnement" name="covid-equipeAccompagnement" v-model="covidComment.equipe_accompagnement" class="input input--checkbox" /> Équipe d'accompagnement
                        </label>
                    </div>

                    <div class="input__group">
                        <label for="covid-distributionAlimentaire">
                            <input type="checkbox" id="covid-distributionAlimentaire" name="covid-distributionAlimentaire" v-model="covidComment.distribution_alimentaire" class="input input--checkbox" /> Distribution d'aide alimentaire
                        </label>
                    </div>

                    <p class="covid-header"><strong>Signaler si nécessaire :</strong></p>
                    <div class="input__group">
                        <label for="covid-personnesOrientees">
                            <input type="checkbox" id="covid-personnesOrientees" name="covid-personnesOrientees" v-model="covidComment.personnes_orientees" class="input input--checkbox" /> Personne(s) orientée(s) vers un centre d'hébergement spécialisé (desserrement)
                        </label>
                    </div>

                    <div class="input__group">
                        <label for="covid-personnesAvecSymptomes">
                            <input type="checkbox" id="covid-personnesAvecSymptomes" name="covid-personnesAvecSymptomes" v-model="covidComment.personnes_avec_symptomes" class="input input--checkbox" /> Personne(s) avec des symptômes Covid-19
                        </label>
                    </div>

                    <div class="input__group">
                        <label for="covid-besoinAction">
                            <input type="checkbox" id="covid-besoinAction" name="covid-v" v-model="covidComment.besoin_action" class="input input--checkbox" /> Besoin d'une action prioritaire
                        </label>
                    </div>

                    <div class="input__group">
                        <textarea v-model="covidComment.description"></textarea>
                    </div>
                    <p><button class="button large" @click="addCovidComment">Ajouter le commentaire</button></p>
                </div>
            </div>

            <div class="sidepanel-section" v-if="town.comments.covid.length === 0">
                <p>Aucun commentaire enregistré pour le moment</p>
            </div>

            <div class="sidepanel-section" v-for="comment in town.comments.covid">
                <article class="userpost userpost--comment">
                    <header class="userpost-header">
                        <p class="userpost-date">Publié le : <time>{{ formatDate(comment.createdAt, 'd M y à h:i') }}</time></p>
                        <p class="userpost-date">Date de l'intervention : <time>{{ formatDate(comment.covid.date, 'd M y') }}</time></p>
                        <h1 class="userpost-title">
                            <router-link :to="`/annuaire/${comment.createdBy.organizationId}`">
                                <font-awesome-icon icon="user"></font-awesome-icon>
                                <span>{{ comment.createdBy.lastName.toUpperCase() }} {{ comment.createdBy.firstName }}</span>
                            </router-link>
                        </h1>
                    </header>
                    <p v-for="tag in covidTags" v-if="comment.covid[tag.prop] === true" class="covidTag">
                        <span :class="`rbTag rbTag--${tag.type}`">{{ tag.label }}</span>
                    </p>
                    <p>{{ comment.description }}</p>
                </article>
            </div>
        </div>
    </div>
</template>

<script>
    import {fr} from "vuejs-datepicker/dist/locale";

    export default {
        props: {
            town: {
                required: true,
                type: Object
            },
            covidTags: {
                required: true,
                type: Object
            },
            covidComment: {
                required: true
            },
            addCovidComment: {
                required: true
            },
            covidErrors: {
                required: true
            }
        },
        methods: {
            formatDate: (...args) => App.formatDate(...args),
        },
        data() {
            return {
                dateLanguage: fr
            }
        }
    }
</script>

<style lang="scss">
    .covidTag {
        margin: 6px 0;
        padding: 0;
    }
</style>
