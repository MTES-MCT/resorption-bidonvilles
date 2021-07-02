<template>
    <Modal :isOpen="isOpen" :closeModal="closeModal" class="modalContainer">
        <template v-slot:title>
            <div>Fermer le site</div>
        </template>
        <template v-slot:body>
            <ValidationObserver ref="form" v-slot="{ handleSubmit }">
                <form @submit.prevent="handleSubmit(submitClose)">
                    <div class="scrollableContainer -mx-4 -mt-8 p-4">
                        <div class="w-64">
                            <DatepickerV2
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

                        <CheckableGroup
                            direction="row"
                            id="closed_with_solutions"
                            rules="required"
                            label="Est-ce que ce site a été résorbé définitivement ?"
                            info="C’est-à-dire sans réinstallation illicite et
                                avec un accompagnement de la majorité des
                                personnes vers des solutions pérennes"
                            validationName="Est-ce que ce site a été résorbé définitivement ?"
                        >
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

                        <CheckableGroup
                            label="Cause de la disparition"
                            id="status"
                            direction="vertical"
                            rules="required"
                            validationName="Cause de la disparition"
                        >
                            <Radio
                                :label="item.label"
                                :checkValue="item.value"
                                v-for="(item, index) in statusValues"
                                :key="index"
                                v-model="form.status"
                            />
                        </CheckableGroup>

                        <CheckableGroup label="Orientations des ménages :">
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
                                <div class="flex items-center ml-10">
                                    <InlineTextInput
                                        label="Ménages : "
                                        type="number"
                                        v-model="
                                            form.solutions[item.id]
                                                .householdsAffected
                                        "
                                        class="mr-4"
                                    />
                                    <InlineTextInput
                                        label="Personnes : "
                                        type="number"
                                        v-model="
                                            form.solutions[item.id]
                                                .peopleAffected
                                        "
                                    />
                                </div>
                            </div>
                        </CheckableGroup>
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
import { get, close } from "#helpers/api/town";
import { get as getConfig } from "#helpers/api/config";
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
        formatDate(d) {
            const year = d.getFullYear();
            const month = `${d.getMonth() + 1}`.padStart(2, "0");
            const day = `${d.getDate()}`.padStart(2, "0");

            return `${year}-${month}-${day}`;
        },
        async submitClose() {
            // clean previous errors
            this.loading = true;
            this.error = null;

            try {
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
                                      this.form.solutions[key].peopleAffected,
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
                                : null
                        }))
                });

                this.$piwik?.trackEvent(
                    "Site",
                    "Fermeture site",
                    this.form.closed_with_solutions
                );
            } catch (err) {
                this.loading = false;
                this.error = err;
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
    data() {
        const { closing_solutions: closingSolutions } = getConfig();

        return {
            loading: false,
            error: null,
            form: {
                closed_at: null,
                closed_with_solutions: null,
                status: null,
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
            closingSolutions,
            dateLanguage: fr,
            checkedSolutions: [],
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
