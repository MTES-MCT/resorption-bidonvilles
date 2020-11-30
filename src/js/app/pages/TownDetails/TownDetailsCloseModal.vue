<template>
    <div class="v1">
        <div class="popin">
            <div class="popin-wrapper" ref="wrapper">
                <div>
                    <p class="popin-close"><span class="link" @click="closePopin"><font-awesome-icon icon="times" size="2x"></font-awesome-icon></span></p>
                    <section>
                        <h2>Disparition du site</h2>

                        <div class="form__group">
                            <label v-bind:class="{ error: fieldErrors.closed_at }">Date de disparition du site :</label>
                            <p class="error" v-if="fieldErrors.closed_at">
                            <ul>
                                <li v-for="error in fieldErrors.closed_at">{{ error }}</li>
                            </ul>
                            </p>
                            <datepicker :clear-button="true" :language="dateLanguage" :monday-first="true" :disabled-dates="{ from: new Date() }" :full-month-name="true" :format="'dd MMMM yyyy'" v-model="edit.closedAt"></datepicker>
                        </div>

                        <div class="form__group">
                            <fieldset>
                                <legend v-bind:class="{ error: fieldErrors.closed_with_solutions }">
                                    <strong>Est-ce que ce site a été résorbé définitivement ? :</strong>
                                </legend>
                                <p class="question-info">C’est-à-dire sans réinstallation illicite et avec un accompagnement de la majorité des personnes vers des solutions pérennes</p>
                                <p class="error" v-if="fieldErrors.closed_with_solutions">
                                <ul>
                                    <li v-for="error in fieldErrors.closed_with_solutions">{{ error }}</li>
                                </ul>
                                </p>

                                <div v-for="(value, index) in closedWithSolutionsValues">
                                    <input type="radio" name="closed_with_solutions" :id="'status' + index" :value="value.value" v-model="edit.closedWithSolutions">
                                    <label :for="'status' + index" class="label-inline">{{ value.label }}</label>
                                </div>
                            </fieldset>
                        </div>

                        <div class="form__group">
                            <fieldset>
                                <legend v-bind:class="{ error: fieldErrors.status }">
                                    <strong>Cause de la disparition :</strong>
                                </legend>
                                <p class="error" v-if="fieldErrors.status">
                                <ul>
                                    <li v-for="error in fieldErrors.status">{{ error }}</li>
                                </ul>
                                </p>
                                <div v-for="(value, index) in statusValues">
                                    <input type="radio" name="status" :id="'status' + index" :value="value.value" v-model="edit.status">
                                    <label :for="'status' + index" class="label-inline">{{ value.label }}</label>
                                </div>
                            </fieldset>
                        </div>

                        <div class="form__group">
                            <fieldset>
                                <legend v-bind:class="{ error: fieldErrors.solutions }">
                                    <strong>Orientations des ménages :</strong>
                                </legend>
                                <fieldset v-for="(value, index) in closingSolutions">
                                    <legend>
                                        <input type="checkbox" name="closingSolution" :id="'closingSolution' + index" :value="value.id" v-model="edit.solutions[value.id].checked">
                                        <label :for="'closingSolution' + index" class="label-inline">{{ value.label }}</label>
                                    </legend>
                                    <div class="solution-people" v-if="edit.solutions[value.id].checked">
                                        <p class="error" v-if="fieldErrors.solutions && fieldErrors.solutions[value.id]">
                                        <ul>
                                            <li v-for="error in fieldErrors.solutions[value.id]">{{ error }}</li>
                                        </ul>
                                        </p>
                                        <p>Nombre de ménages concernés :<br/><input type="number" v-model="edit.solutions[value.id].householdsAffected" /></p>
                                        <p>Nombre de personnes concernées :<br/><input type="number" v-model="edit.solutions[value.id].peopleAffected" /></p>
                                    </div>
                                </fieldset>
                            </fieldset>
                        </div>

                        <div class="notification error" v-if="editError">{{ editError }}.</div>

                        <div class="form__group">
                            <button @click="submitClose" class="button">Valider</button>
                            <button @click="closePopin" class="button secondary">Annuler</button>
                        </div>
                    </section>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import Datepicker from "vuejs-datepicker";
import { fr } from "vuejs-datepicker/dist/locale";
import {
    get,
    close
} from "#helpers/api/town";
import {get as getConfig} from "#helpers/api/config";
import { notify } from "#helpers/notificationHelper";

export default {
    components: {Datepicker},
    props: {
        town: {
            type: Object
        }
    },
    mounted() {
        console.log(this.edit)
    },
    methods: {
        submitClose() {
            // clean previous errors
            this.editError = null;
            this.fieldErrors = {};

            // send the form
            close(this.town.id, {
                closed_at: this.edit.closedAt,
                closed_with_solutions: this.edit.closedWithSolutions,
                status: this.edit.status,
                solutions: Object.keys(this.edit.solutions)
                    .filter(key => this.edit.solutions[key].checked)
                    .map(key => ({
                        id: key,
                        peopleAffected: this.edit.solutions[key].peopleAffected
                            ? parseInt(
                                this.edit.solutions[key].peopleAffected,
                                10
                            )
                            : null,
                        householdsAffected: this.edit.solutions[key]
                            .householdsAffected
                            ? parseInt(
                                this.edit.solutions[key].householdsAffected,
                                10
                            )
                            : null
                    }))
            })
                .then(() => {
                    notify({
                        group: "notifications",
                        type: "success",
                        title: "Site correctement fermé",
                        text: "Le site a bien été marqué comme fermé"
                    });

                    this.loading = true;
                    this.error = null;

                    return get(this.$route.params.id)
                        .then(town => {
                            this.loading = false;
                            this.$emit('updateTown', town)
                            this.closePopin()
                        })
                        .catch(errors => {
                            this.error = errors.user_message;
                            this.loading = false;
                        });
                })
                .catch(response => {
                    this.editError = response.user_message;
                    this.fieldErrors = response.fields || {};
                });
        },
        closePopin() {
            this.$emit('cancelCloseTown')
        },

    },
    data() {
        const { closing_solutions: closingSolutions } = getConfig()

        return {
            edit: {
                ...this.town,
                solutions: this.town.closingSolutions
                    ? closingSolutions.reduce((solutions, solution) => {
                        const newSolutions = Object.assign(solutions, {});
                        const s = this.town.closingSolutions.find(
                            sol => sol.id === solution.id
                        );
                        newSolutions[solution.id] = {
                            checked: s !== undefined,
                            peopleAffected: s && s.peopleAffected,
                            householdsAffected: s && s.householdsAffected
                        };

                        return newSolutions;
                    }, {})
                    : []
            },
            editError: null,
            closingSolutions ,
            fieldErrors: {},
            dateLanguage: fr,
            closedWithSolutionsValues: [
                { value: true, label: "Oui" },
                { value: false, label: "Non" }
            ],
            statusValues: [
                {
                    value: "closed_by_justice",
                    label: "Exécution d'une décision de justice"
                },
                {
                    value: "closed_by_admin",
                    label: "Exécution d'une décision administrative"
                },
                { value: "other", label: "Autre" },
                { value: "unknown", label: "Raison inconnue" }
            ],
        }

    }
}
</script>
