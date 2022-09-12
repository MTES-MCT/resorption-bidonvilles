<template>
    <Modal :isOpen="isOpen" :closeModal="closeModal" class="modalContainer">
        <template v-slot:title>
            <div>
                {{
                    isAlreadyClosed
                        ? "Corriger la fermeture du site"
                        : "Fermer le site"
                }}
            </div>
        </template>
        <template v-slot:body>
            <ValidationObserver ref="form" v-slot="{ handleSubmit }">
                <form @submit.prevent="handleSubmit(submitClose)">
                    <div class="scrollableContainer -mx-4 -mt-8 p-4">
                        <div class="w-64">
                            <DatepickerV2
                                v-if="!isAlreadyClosed"
                                label="Date de la fermeture du site"
                                class=""
                                v-model="form.closed_at"
                                id="closed_at"
                                validationName="Date"
                                :disabled-dates="{ from: new Date() }"
                                :language="dateLanguage"
                                :monday-first="true"
                                :full-month-name="true"
                                :format="'dd MMMM yyyy'"
                                rules="required"
                            />
                        </div>
                        <div v-if="isAlreadyClosed" class="mb-4">
                            <span class="font-bold">
                                Date de fermeture du site :
                            </span>

                            {{ formatDate(form.closed_at, true) }}
                        </div>

                        <CheckableGroup
                            v-if="!isAlreadyClosed"
                            label="Cause de la fermeture"
                            id="status"
                            direction="vertical"
                            rules="required"
                            validationName="Cause de la fermeture"
                        >
                            <Radio
                                :label="item.label"
                                :checkValue="item.value"
                                v-for="(item, index) in statusValues"
                                :key="index"
                                v-model="form.status"
                            />
                        </CheckableGroup>

                        <TextInput
                            v-if="!isAlreadyClosed"
                            label="Préciser le contexte de la fermeture et les
                                faits à signaler (incendie, violences, départ
                                spontané des habitants...)"
                            v-model="form.closing_context"
                        ></TextInput>

                        <CheckableGroup
                            v-if="!isAlreadyClosed"
                            label="Orientations des ménages :"
                        >
                            <div
                                v-for="(item, index) in closingSolutions"
                                :key="item.id"
                            >
                                <Checkbox
                                    :label="item.label"
                                    :key="index"
                                    :checkValue="item.id"
                                    v-model="checkedSolutions"
                                    id="solutions"
                                />
                                <div v-if="checkedSolutions.includes(item.id)">
                                    <div class="flex items-center mb-4">
                                        <InlineTextInput
                                            label="Ménages"
                                            type="number"
                                            v-model="
                                                form.solutions[item.id]
                                                    .householdsAffected
                                            "
                                            class="mr-4"
                                        />
                                        <InlineTextInput
                                            label="Personnes"
                                            type="number"
                                            v-model="
                                                form.solutions[item.id]
                                                    .peopleAffected
                                            "
                                        />
                                    </div>
                                    <TextInput
                                        v-model="
                                            form.solutions[item.id].message
                                        "
                                        placeholder="commentaires, précisions..."
                                    ></TextInput>
                                </div>
                            </div>
                        </CheckableGroup>

                        <CheckableGroup
                            direction="row"
                            id="closed_with_solutions"
                            rules="required"
                            label="Est-ce que ce site a été résorbé définitivement ?"
                            :info="resorbed"
                            validationName="Est-ce que ce site a été résorbé définitivement ?"
                        >
                            <span class="mb-4"
                                >Un site est considéré comme résorbé si une
                                solution pérenne en logement ou hébergement est
                                mise en place pour 66% des habitants du site.
                            </span>
                            <Radio
                                :checkValue="true"
                                label="Oui"
                                v-model="form.closed_with_solutions"
                                variant="card"
                                class="mr-1"
                            />
                            <Radio
                                :checkValue="false"
                                label="Non"
                                variant="card"
                                v-model="form.closed_with_solutions"
                            />
                        </CheckableGroup>
                    </div>

                    <div v-if="error !== null" class="text-red py-2 px-4 mb-4">
                        {{ error.user_message }}
                        <ul v-if="errors && errors.length > 0" class="text-sm">
                            <li v-for="(err, index) in errors" :key="index">
                                - {{ err }}
                            </li>
                        </ul>
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
import { fr } from "vuejs-datepicker/dist/locale";
import { get, close, fixClosedStatus } from "#helpers/api/town";
import { notify } from "#helpers/notificationHelper";
import InlineTextInput from "#app/components/ui/Form/input/InlineTextInput";
import CheckableGroup from "#app/components/ui/Form/CheckableGroup";

export default {
    components: { CheckableGroup, InlineTextInput },
    props: {
        isOpen: {
            type: Boolean
        },
        town: {
            type: Object
        }
    },

    methods: {
        closeModal() {
            this.$emit("closeModal");
        },
        formatDate(d, display = false) {
            const year = d.getFullYear();
            const month = `${d.getMonth() + 1}`.padStart(2, "0");
            const day = `${d.getDate()}`.padStart(2, "0");

            return display === true
                ? `${day}/${month}/${year}`
                : `${year}-${month}-${day}`;
        },
        async submitClose() {
            // clean previous errors
            this.loading = true;
            this.error = null;

            try {
                if (this.isAlreadyClosed) {
                    await fixClosedStatus(this.town.id, {
                        closed_with_solutions: this.form.closed_with_solutions
                    });
                } else {
                    await close(this.town.id, {
                        ...this.form,
                        closed_at: this.formatDate(this.form.closed_at),
                        solutions: Object.keys(this.form.solutions)
                            .filter(key => this.form.solutions[key].checked)
                            .map(key => ({
                                id: key,
                                peopleAffected: this.form.solutions[key]
                                    .peopleAffected
                                    ? parseInt(
                                          this.form.solutions[key]
                                              .peopleAffected,
                                          10
                                      )
                                    : null,
                                householdsAffected: this.form.solutions[key]
                                    .householdsAffected
                                    ? parseInt(
                                          this.form.solutions[key]
                                              .householdsAffected,
                                          10
                                      )
                                    : null,
                                message: this.form.solutions[key].message
                            }))
                    });

                    this.$trackMatomoEvent(
                        "Site",
                        "Fermeture site",
                        `S${this.town.id}`
                    );

                    if (this.form.closed_with_solutions) {
                        this.$trackMatomoEvent(
                            "Site",
                            "Résorption du site",
                            `S${this.town.id}`
                        );
                    }
                }
            } catch (err) {
                this.loading = false;
                this.error = err;
                this.errors = Object.values(err.fields).flat();
                this.$refs.form.setErrors(err.fields);
                return;
            }

            notify({
                group: "notifications",
                type: "success",
                title: "Site correctement fermé",
                text: "Le site a bien été marqué comme fermé"
            });

            this.loading = false;
            this.closeModal();

            const updatedTown = await get(this.$route.params.id);
            await this.$store.dispatch("setDetailedTown", updatedTown);
        },
        closePopin() {
            this.$emit("cancelCloseTown");
        }
    },
    computed: {
        resorbed() {
            let populationResorbed = 0;
            this.closingSolutions.forEach(solution => {
                if (
                    [
                        "Hébergement ou logement adapté longue durée avec accompagnement, dont espace terrain d’insertion",
                        "Logement"
                    ].includes(solution.label) &&
                    this.checkedSolutions.includes(solution.id)
                ) {
                    populationResorbed =
                        populationResorbed +
                        parseInt(
                            this.form.solutions[solution.id].peopleAffected ||
                                0,
                            10
                        );
                }
            });
            return this.town.populationTotal
                ? `D'après les informations renseignées, environ 
                    ${(
                        (populationResorbed * 100) /
                        this.town.populationTotal
                    ).toFixed(0)}%
                    des habitants du site ont été
                    orientées vers une solution d’hébergement, de
                    logement adapté longue durée avec accompagnement,
                    dont espace terrain d’insertion, ou logement`
                : "";
        }
    },

    data() {
        const {
            closing_solutions: closingSolutions
        } = this.$store.state.config.configuration;

        return {
            isAlreadyClosed: this.town.closedAt !== null,
            loading: false,
            error: null,
            errors: null,
            form: {
                closed_at: this.town.closedAt
                    ? new Date(this.town.closedAt * 1000)
                    : null,
                closed_with_solutions: this.town.closedWithSolutions
                    ? this.town.closedWithSolutions === "yes"
                    : null,
                status: null,
                closing_context: "",
                solutions: this.town.closingSolutions
                    ? closingSolutions.reduce((solutions, solution) => {
                          const newSolutions = Object.assign(solutions, {});
                          const s = this.town.closingSolutions.find(
                              sol => sol.id === solution.id
                          );
                          newSolutions[solution.id] = {
                              checked: s !== undefined,
                              peopleAffected: s && s.peopleAffected,
                              householdsAffected: s && s.householdsAffected,
                              message: s && s.message
                          };

                          return newSolutions;
                      }, {})
                    : []
            },
            closingSolutions,
            dateLanguage: fr,
            checkedSolutions: [],
            statusValues: [
                {
                    value: "resorbed",
                    label: "Résorption progressive du site"
                },
                {
                    value: "closed_by_justice",
                    label:
                        "Décision de justice suite à une plainte du propriétaire"
                },
                {
                    value: "closed_by_pref_admin",
                    label: "Décision administrative de la Préfecture"
                },
                {
                    value: "closed_by_city_admin",
                    label: "Décision administrative de la Commune"
                },
                { value: "other", label: "Autre (préciser le contexte)" },
                { value: "unknown", label: "Raison inconnue" }
            ]
        };
    },
    watch: {
        // Dirty hack as normally Checkbox works with Array
        checkedSolutions: function(newVal) {
            Object.keys(this.form.solutions).forEach(key => {
                this.form.solutions[key].checked = newVal.includes(Number(key));
            });
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
