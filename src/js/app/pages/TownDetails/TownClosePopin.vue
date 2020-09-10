<template>
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
                                <div class="solution-people" v-bind:class="{ visible: edit.solutions[value.id].checked }">
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

                    <div class="notification error" v-if="editError">{{ editError }}.</div>

                    <div class="form__group">
                        <button @click="submitClose" class="button">Valider</button>
                        <button @click="closePopin" class="button secondary">Annuler</button>
                    </div>
                </section>
            </div>
        </div>
    </div>
</template>


<script>
    import Datepicker from 'vuejs-datepicker';
    import {get as getConfig} from "#helpers/api/config";
    import { fr } from 'vuejs-datepicker/dist/locale';

    export default {
        components: {
            Datepicker
        },
        props: {
            fieldErrors: {
                required: true
            },
            edit: {
                required: true
            },
            editError: {},
            submitClose: {
                type: Function,
                required: true
            },
            closePopin: {
                type: Function,
                required: true
            }
        },
        data() {
            return {
                closingSolutions: getConfig().closing_solutions,
                statusValues: [
                    { value: 'closed_by_justice', label: 'Exécution d\'une décision de justice' },
                    { value: 'closed_by_admin', label: 'Exécution d\'une décision administrative' },
                    { value: 'other', label: 'Autre' },
                    { value: 'unknown', label: 'Raison inconnue' },
                ],
                closedWithSolutionsValues: [
                    { value: true, label: 'Oui' },
                    { value: false, label: 'Non' },
                ],
                dateLanguage: fr,
            }
        }
    }
</script>

<style lang="scss" scoped>
    .question-info {
        margin-top: 0;
    }

    .solution-people {
        margin-left: 50px;
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.2s linear;
        -webkit-transition: max-height 0.2s linear;

        input {
            max-width: 100px;
        }

        &.visible {
            max-height: 200px;
            margin-bottom: 30px;
        }
    }
</style>
