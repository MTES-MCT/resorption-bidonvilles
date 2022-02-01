<template>
    <ValidationObserver ref="form" @submit.prevent="submit" v-slot="{ errors }">
        <form>
            <div class="bg-G100 py-8">
                <PrivateContainer class="flex justify-between items-baseline">
                    <div class="text-display-lg">{{ submitWording }}</div>
                    <div>
                        <Button
                            variant="primaryText"
                            @click="back"
                            type="button"
                            >Annuler</Button
                        >
                        <Button
                            class="ml-5"
                            variant="tertiary"
                            :loading="loading"
                            data-cy-button="submit"
                            >Valider</Button
                        >
                    </div>
                </PrivateContainer>
            </div>

            <PrivateContainer class="flex pt-10">
                <FormLeftColumn class="leftColumnWidth" :sections="sections" />

                <div class="flex-1">
                    <PlanFormPanelInfo></PlanFormPanelInfo>

                    <FormErrorLog
                        id="erreurs"
                        class="mt-8 mb-8"
                        :mainError="mainError"
                        :errors="errors"
                    ></FormErrorLog>

                    <PlanFormPanelCharacteristics
                        class="mt-10 planPanelShadow"
                        id="characteristics"
                        v-model="plan.characteristics"
                    ></PlanFormPanelCharacteristics>

                    <PlanFormPanelLocation
                        class="mt-10 planPanelShadow"
                        id="location"
                        v-model="plan.location"
                    ></PlanFormPanelLocation>

                    <PlanFormPanelPeople
                        class="mt-10 planPanelShadow"
                        id="people"
                        v-model="plan.people"
                    ></PlanFormPanelPeople>

                    <PlanFormPanelFinancial
                        class="mt-10 planPanelShadow"
                        id="financial"
                        v-model="plan.financial"
                        :realAmount="mode === 'create' ? 'none' : 'past'"
                    ></PlanFormPanelFinancial>

                    <div class="mt-8 text-right italic text-red font-bold">
                        * : Réponses obligatoires
                    </div>
                </div>
            </PrivateContainer>

            <div class="pt-12 pb-16">
                <PrivateContainer class="flex justify-end items-baseline">
                    <Button variant="primaryText" @click="back" type="button"
                        >Annuler</Button
                    >
                    <Button class="ml-5" variant="tertiary" :loading="loading"
                        >Valider</Button
                    >
                </PrivateContainer>
            </div>
        </form>
    </ValidationObserver>
</template>

<style scoped>
.planPanelShadow {
    box-shadow: 0 0px 20px 0 rgba(0, 0, 0, 0.1), 0 0px 0px 0 rgba(0, 0, 0, 0.06);
    border-radius: 5px;
}
</style>

<script>
import PrivateContainer from "#app/components/PrivateLayout/PrivateContainer";
import PlanFormPanelInfo from "./PlanFormPanelInfo";
import PlanFormPanelCharacteristics from "./PlanFormPanelCharacteristics";
import PlanFormPanelLocation from "./PlanFormPanelLocation";
import PlanFormPanelPeople from "./PlanFormPanelPeople";
import PlanFormPanelFinancial from "./PlanFormPanelFinancial";
import FormLeftColumn from "#app/components/ui/Form/FormLeftColumn";
import FormErrorLog from "#app/components/ui/Form/FormErrorLog";
import { notify } from "#helpers/notificationHelper";
import { create, update } from "#helpers/api/plan";

export default {
    props: {
        mode: {
            type: String
        },
        data: {
            type: Object,
            default() {
                return {};
            }
        }
    },

    components: {
        PrivateContainer,
        FormLeftColumn,
        FormErrorLog,
        PlanFormPanelInfo,
        PlanFormPanelCharacteristics,
        PlanFormPanelLocation,
        PlanFormPanelPeople,
        PlanFormPanelFinancial
    },

    data() {
        return {
            mainError: null,
            loading: false,
            sections: [
                { id: "characteristics", label: "Intervention" },
                { id: "location", label: "Lieu" },
                { id: "people", label: "Contacts" },
                { id: "financial", label: "Financement" }
            ],
            plan: {
                characteristics: {
                    name: this.data.name || undefined,
                    departement: this.data.departement
                        ? this.data.departement.code
                        : undefined,
                    started_at: this.data.started_at
                        ? new Date(this.data.started_at)
                        : undefined,
                    expected_to_end_at: this.data.expected_to_end_at
                        ? new Date(this.data.expected_to_end_at)
                        : undefined,
                    in_and_out:
                        typeof this.data.in_and_out === "boolean"
                            ? this.data.in_and_out
                            : undefined,
                    topics: this.data.topics
                        ? this.data.topics.map(({ uid }) => uid)
                        : [],
                    goals: this.data.goals || undefined
                },
                location: {
                    location_type: this.data.location_type
                        ? this.data.location_type.id
                        : undefined,
                    location_details: this.data.location_details || undefined,
                    location_shantytowns: this.data.shantytowns
                        ? this.data.shantytowns.map(({ id }) => id)
                        : [],
                    location_address: {
                        address: {
                            label:
                                (this.data.location &&
                                    this.data.location.address) ||
                                undefined,
                            citycode: undefined
                        },
                        coordinates: this.data.location
                            ? [
                                  this.data.location.latitude,
                                  this.data.location.longitude
                              ]
                            : undefined
                    }
                },
                people: {
                    government: this.data.government_contacts
                        ? this.data.government_contacts[0]
                        : undefined,
                    association: this.data.operator_contacts
                        ? this.data.operator_contacts[0].organization
                        : undefined,
                    contact: this.data.operator_contacts
                        ? this.data.operator_contacts[0].id
                        : undefined
                },
                financial: {
                    finances: this.data.finances
                        ? this.data.finances.map(finances => {
                              return {
                                  ...finances,
                                  data: finances.data.map(row => ({
                                      ...row,
                                      type: row.type.uid
                                  }))
                              };
                          })
                        : []
                }
            }
        };
    },

    computed: {
        submitWording() {
            return this.mode === "create"
                ? "Déclarer un dispositif"
                : "Mettre à jour";
        },

        successNotificationWording() {
            return this.mode === "create"
                ? "La déclaration du dispositif a réussi"
                : "Le dispositif a bien été modifié";
        },

        backPage() {
            if (this.mode === "create") {
                return "/liste-des-dispositifs";
            }

            return `/dispositif/${this.data.id}`;
        }
    },

    methods: {
        back() {
            this.$router.replace(this.backPage);
        },

        formatDate(d) {
            if (!d || !(d instanceof Date)) {
                return d;
            }

            const year = d.getFullYear();
            const month = `${d.getMonth() + 1}`.padStart(2, "0");
            const day = `${d.getDate()}`.padStart(2, "0");

            return `${year}-${month}-${day}`;
        },

        boolToInt(bool) {
            if (bool === undefined) {
                return undefined;
            }

            if (bool === true) {
                return 1;
            }

            if (bool === false) {
                return 0;
            }

            return -1;
        },

        async submit() {
            const isValid = await this.$refs.form.validate();
            if (!isValid) {
                this.$router.replace("#top", () =>
                    this.$router.replace("#erreurs")
                );
                return;
            }

            this.loading = true;
            this.mainError = null;
            this.$router.replace("#top");

            try {
                const result = await this.submitFn({
                    name: this.plan.characteristics.name,
                    departement: this.plan.characteristics.departement,
                    startedAt: this.formatDate(
                        this.plan.characteristics.started_at
                    ),
                    expectedToEndAt: this.formatDate(
                        this.plan.characteristics.expected_to_end_at
                    ),
                    in_and_out: this.boolToInt(
                        this.plan.characteristics.in_and_out
                    ),
                    topics: this.plan.characteristics.topics,
                    goals: this.plan.characteristics.goals,
                    locationType: this.plan.location.location_type,
                    locationShantytowns:
                        this.plan.location.location_type === "shantytowns"
                            ? this.plan.location.location_shantytowns
                            : undefined,
                    locationAddress:
                        this.plan.location.location_type === "location"
                            ? {
                                  address: {
                                      label: this.plan.location.location_address
                                          .address.label
                                  },
                                  location: {
                                      coordinates: this.plan.location
                                          .location_address.coordinates
                                  }
                              }
                            : undefined,
                    locationDetails:
                        this.plan.location.location_type === "other"
                            ? this.plan.location.location_details
                            : undefined,
                    government: this.plan.people.government
                        ? [{ id: this.plan.people.government.id }]
                        : undefined,
                    contact: this.plan.people.contact
                        ? this.plan.people.contact
                        : undefined,
                    finances: this.plan.financial.finances
                });

                this.loading = false;

                let id;
                if (this.mode === "create") {
                    id = result.id;
                } else {
                    id = this.data.id;
                }

                this.$router.push(`/dispositif/${id}`);

                notify({
                    group: "notifications",
                    type: "success",
                    title: "Succès",
                    text: this.successNotificationWording
                });
            } catch (err) {
                this.loading = false;

                if (err && err.fields) {
                    this.$refs.form.setErrors(err.fields);
                }

                this.mainError =
                    (err && err.user_message) ||
                    "Une erreur inconnue est survenue";

                this.$router.replace("#erreurs");
            }
        },

        async submitFn(data) {
            if (this.mode === "create") {
                const result = await create(data);
                this.$trackMatomoEvent(
                    "Dispositif",
                    "Création dispositif",
                    `D${result.id}`
                );
                return result;
            }

            this.$trackMatomoEvent(
                "Dispositif",
                "Mise à jour dispositiif",
                `D${this.data.id}`
            );
            return update(this.data.id, data);
        }
    }
};
</script>

<style scoped>
.leftColumnWidth {
    min-width: 300px;
    max-width: 300px;
    @apply pr-10;
}
</style>
