<template>
    <FormGroup title="Entrées et sorties du dispositif">
        <FormParagraph :title="title">
            <div class="mb-3 text-G600">
                <p v-if="dateOfLastState === null">
                    Vous renseignez les indicateurs de suivi pour la première
                    fois. Veuillez porter une attention particulière aux données
                    que vous renseignez ci-dessous : les mises à jour
                    ultérieures seront conditionnées par cette première
                    déclaration.
                </p>
                <div v-else>
                    <p v-if="plan.in_and_out === true">
                        Les entrées et sorties du dispositif sont suivies, car
                        le pilote de l’action au sein des services de l’Etat a
                        renseigné qu’il existe un système d’entrées et de
                        sorties.
                    </p>
                    <p v-else>
                        Seules les sorties du dispositif sont suivies, car le
                        pilote de l’action au sein des services de l’Etat a
                        renseigné qu’il n’existe pas de système d’entrées et de
                        sorties du dispositif : le dispositif concerne un seul
                        groupe de personne, ayant débuté le projet à la même
                        période.
                    </p>
                    <p class="font-bold">
                        Attention : le remplissage de ce tableau a un impact sur
                        le nombre de personnes identifiées dans ce dispositif.
                        Merci de le renseigner avec attention.
                    </p>
                    <p class="mt-4">
                        Au {{ dateOfLastState }}, date de la dernière mise à
                        jour des informations, sont intégrés dans le dispositif
                        : {{ plan.audience.families }} ménages,
                        {{ plan.audience.total }} personnes dont
                        {{ plan.audience.women }} femmes et
                        {{ plan.audience.minors }} mineurs
                    </p>
                </div>
            </div>

            <InputAudience
                v-model="input"
                :mode="mode"
                validationName="audience"
            />
        </FormParagraph>
    </FormGroup>
</template>

<script>
import InputAudience from "#app/components/InputAudience/InputAudience.vue";

export default {
    props: {
        value: {
            type: Object,
            required: true
        },
        plan: {
            type: Object,
            required: true
        }
    },

    components: {
        InputAudience
    },

    data() {
        return {
            input: { ...this.value }
        };
    },

    watch: {
        input() {
            this.$emit("input", this.input);
        }
    },

    computed: {
        dateOfLastState() {
            if (this.plan.states.length === 0) {
                return null;
            }

            const [lastState] = this.plan.states.slice(-1);
            return App.formatDate(lastState.date / 1000, "d/m/y");
        },
        title() {
            if (this.dateOfLastState === null) {
                return "Qui sont les publics ayant intégré le dispositif ?";
            }

            return `Quelles ont été les entrées et sorties du dispositif depuis la date du ${this.dateOfLastState} ?`;
        },
        mode() {
            if (this.plan.states.length === 0) {
                return "in_only";
            }

            if (this.plan.in_and_out !== true) {
                return "out_only";
            }

            return "in_and_out";
        }
    },

    methods: {
        formatDate(...args) {
            return window.App.formatDate.apply(window, args);
        }
    }
};
</script>
