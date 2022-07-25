<template>
    <ValidationObserver ref="form" @submit.prevent="submit" v-slot="{ errors }">
        <form>
            <div class="bg-G100 py-8">
                <PrivateContainer class="flex justify-between items-baseline">
                    <div class="text-display-lg font-bold">
                        {{ submitWording }}
                    </div>
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
                <FormLeftColumn
                    class="leftColumnWidth"
                    :sections="sections"
                    defaultSection="characteristics"
                />
                <div class="flex-1">
                    <TownFormPanelInfo
                        v-if="showInfo"
                        @close="closeInfo()"
                    ></TownFormPanelInfo>

                    <FormErrorLog
                        id="erreurs"
                        class="mt-8 mb-8"
                        :mainError="mainError"
                        :errors="errors"
                    ></FormErrorLog>

                    <TownFormPanelLocation
                        v-if="town.characteristics.declared_at"
                        class="mt-10"
                        v-model="town.location"
                        :declaredAt="town.characteristics.declared_at"
                        @shareClosedTowns="showClosedTowns"
                        @noAddressEntered="noAddressEntered"
                    ></TownFormPanelLocation>

                    <TownFormPanelCharacteristics
                        class="mt-10 townPanelShadow"
                        id="characteristics"
                        v-model="town.characteristics"
                        @declaredAtChanged="swapIsReinstallation"
                    ></TownFormPanelCharacteristics>

                    <template v-if="town.characteristics.declared_at">
                        <TownFormPanelPeople
                            class="mt-10 townPanelShadow"
                            id="people"
                            :nearbyClosedShantytowns="nearbyClosedShantytowns"
                            :mode="mode"
                            :noAddressProvided="noAddressProvided"
                            v-model="town.people"
                        ></TownFormPanelPeople>

                        <TownFormPanelLivingConditions
                            class="mt-10 townPanelShadow"
                            id="living_conditions"
                            :population="town.people.population"
                            v-model="town.living_conditions"
                        ></TownFormPanelLivingConditions>
                        <TownFormPanelJudicial
                            class="mt-10 townPanelShadow"
                            id="judicial"
                            v-model="town.judicial"
                            v-if="hasJusticePermission"
                        ></TownFormPanelJudicial>
                    </template>

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
.townPanelShadow {
    box-shadow: 0 0px 20px 0 rgba(0, 0, 0, 0.1), 0 0px 0px 0 rgba(0, 0, 0, 0.06);
    border-radius: 5px;
}
</style>

<script>
import PrivateContainer from "#app/components/PrivateLayout/PrivateContainer";
import TownFormPanelInfo from "./TownFormPanelInfo";
import TownFormPanelLocation from "./TownFormPanelLocation";
import TownFormPanelCharacteristics from "./TownFormPanelCharacteristics";
import TownFormPanelPeople from "./TownFormPanelPeople";
import TownFormPanelLivingConditions from "./TownFormPanelLivingConditions";
import TownFormPanelJudicial from "./TownFormPanelJudicial";
import FormLeftColumn from "#app/components/ui/Form/FormLeftColumn";
import FormErrorLog from "#app/components/ui/Form/FormErrorLog";
import { add, edit } from "#helpers/api/town";
import { notify } from "#helpers/notificationHelper";
import formatTown from "./utils/formatTown";
const { isEqual } = require("lodash");
import { get } from "#helpers/api/geo";

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
        TownFormPanelInfo,
        TownFormPanelLocation,
        TownFormPanelCharacteristics,
        TownFormPanelPeople,
        TownFormPanelLivingConditions,
        TownFormPanelJudicial
    },

    data() {
        return {
            declaredAt: null,
            nearbyClosedShantytowns: [],
            mainError: null,
            loading: false,
            showInfo: true,
            initialTown: this.formatTown(this.data),
            town: this.formatTown(this.data),
            noAddressProvided: true
        };
    },

    computed: {
        sections() {
            const sections = [
                { id: "characteristics", label: "Caractéristiques du site" },
                { id: "people", label: "Habitants" },
                {
                    id: "living_conditions",
                    label: "Conditions de vie et environnement"
                }
            ];
            if (this.hasJusticePermission) {
                sections.push({
                    id: "judicial",
                    label: "Procédure judiciaire"
                });
            }

            return sections;
        },
        fieldTypes() {
            return this.$store.state.config.configuration.field_types;
        },
        user() {
            return this.$store.state.config.configuration.user;
        },
        submitWording() {
            return this.mode === "create"
                ? "Déclarer un site"
                : "Mettre à jour";
        },

        successNotificationWording() {
            return this.mode === "create"
                ? "La déclaration du site a réussi"
                : "Le site a bien été modifié";
        },

        backPage() {
            if (this.mode === "create") {
                return "/liste-des-sites";
            }

            return `/site/${this.data.id}`;
        },

        hasJusticePermission() {
            return this.$store.getters["config/hasLocalizedPermission"](
                "shantytown_justice.access",
                {
                    ...this.data,
                    region: this.town.region,
                    departement: this.town.departement,
                    epci: this.town.epci,
                    city: this.town.city
                }
            );
        },
        isAddressFull() {
            return this.isEmptyObject(this.town.location.address);
        }
    },

    watch: {
        // lorsqu'une nouvelle adresse est saisie, on ne dispose pas des informations de
        // localisation précise (région, département, etc.)
        // or, ces informations sont nécessaires pour déterminer si les données judiciaires
        // sont accessibles à l'utilisateur(ice)
        // donc, on fetch ces informations à chaque changement d'adresse
        "town.location.address.citycode": async function() {
            // on reset les données de localisation immédiatement
            this.town.region = null;
            this.town.departement = null;
            this.town.epci = null;
            this.town.city = null;

            const citycode = this.town?.location?.address?.citycode;
            if (!citycode) {
                return;
            }

            // on fetch les données depuis l'API
            const data = await get("city", citycode);
            this.town.region = data.region;
            this.town.departement = data.departement;
            this.town.epci = data.epci;
            this.town.city = data.city;
        }
    },

    methods: {
        formatTown,
        isEmptyObject(value) {
            return (
                Object.prototype.toString.call(value) === "[object Object]" &&
                JSON.stringify(value) === "{}"
            );
        },
        back() {
            this.$router.replace(this.backPage);
        },

        closeInfo() {
            this.showInfo = false;
        },

        strToInt(str) {
            if (str === "") {
                return null;
            }

            return parseInt(str, 10);
        },

        nullableStr(str) {
            if (str === "null") {
                return null;
            }

            return str;
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

        async submit() {
            const isValid = await this.$refs.form.validate();
            if (!isValid) {
                this.$router.replace("#top", () =>
                    this.$router.replace("#erreurs")
                );
                return;
            }
            if (isEqual(this.town, this.initialTown)) {
                this.mainError =
                    "Modification impossible : aucun champ n'a été modifié";
                this.$router.replace("#top", () =>
                    this.$router.replace("#erreurs")
                );
                return;
            }
            this.loading = true;
            this.mainError = null;
            this.$router.replace("#top");

            try {
                const [lat, lon] = this.town.location.coordinates;

                const result = await this.submitFn({
                    ...this.town.living_conditions,
                    water_hand_wash_access_number: this.town.living_conditions
                        .water_hand_wash_access
                        ? this.strToInt(
                              this.town.living_conditions
                                  .water_hand_wash_access_number
                          )
                        : null,
                    trash_cans_on_site: this.strToInt(
                        this.town.living_conditions.trash_cans_on_site
                    ),
                    sanitary_number: this.strToInt(
                        this.town.living_conditions.sanitary_number
                    ),
                    address: this.town.location.address.label,
                    citycode: this.town.location.address.citycode,
                    name: this.town.location.name,
                    coordinates: this.town.location.coordinates
                        ? `${lat},${lon}`
                        : undefined,
                    built_at: this.formatDate(
                        this.town.characteristics.built_at
                    ),
                    declared_at: this.formatDate(
                        this.town.characteristics.declared_at
                    ),
                    field_type: this.town.characteristics.field_type,
                    detailed_address: this.town.characteristics
                        .detailed_address,
                    owner_type: this.town.characteristics.owner_type,
                    owner: this.town.characteristics.owner,
                    is_reinstallation: this.town.people.is_reinstallation,
                    location_shantytowns: this.town.people.location_shantytowns,
                    reinstallation_comments: this.town.people
                        .reinstallation_comments,
                    population_total: this.strToInt(
                        this.town.people.population.populationTotal
                    ),
                    population_couples: this.strToInt(
                        this.town.people.population.populationCouples
                    ),
                    population_minors: this.strToInt(
                        this.town.people.population.populationMinors
                    ),
                    population_minors_0_3: this.strToInt(
                        this.town.people.populationMinors.populationMinors0To3
                    ),
                    population_minors_3_6: this.strToInt(
                        this.town.people.populationMinors.populationMinors3To6
                    ),
                    population_minors_6_12: this.strToInt(
                        this.town.people.populationMinors.populationMinors6To12
                    ),
                    population_minors_12_16: this.strToInt(
                        this.town.people.populationMinors.populationMinors12To16
                    ),
                    population_minors_16_18: this.strToInt(
                        this.town.people.populationMinors.populationMinors16To18
                    ),
                    minors_in_school: this.strToInt(
                        this.town.people.populationMinors.minorsInSchool
                    ),
                    caravans: this.strToInt(
                        this.town.people.caravansAndHuts.caravans
                    ),
                    huts: this.strToInt(this.town.people.caravansAndHuts.huts),
                    social_origins: this.town.people.social_origins,
                    census_status: this.nullableStr(
                        this.town.people.census_status
                    ),
                    census_conducted_at: this.formatDate(
                        this.town.people.census_conducted_at
                    ),
                    census_conducted_by: this.town.people.census_conducted_by,
                    owner_complaint: this.town.judicial.owner_complaint,
                    justice_procedure: this.town.judicial.justice_procedure,
                    justice_rendered: this.town.judicial.justice_rendered,
                    justice_rendered_at: this.formatDate(
                        this.town.judicial.justice_rendered_at
                    ),
                    justice_rendered_by: this.town.judicial.justice_rendered_by,
                    justice_challenged: this.town.judicial.justice_challenged,
                    police_status: this.nullableStr(
                        this.town.judicial.police_status
                    ),
                    police_requested_at: this.formatDate(
                        this.town.judicial.police_requested_at
                    ),
                    police_granted_at: this.formatDate(
                        this.town.judicial.police_granted_at
                    ),
                    bailiff: this.town.judicial.bailiff
                });

                this.loading = false;

                let id;
                if (this.mode === "create") {
                    id = result.town.id;
                } else {
                    id = this.data.id;
                }

                this.$router.push(`/site/${id}`);

                notify({
                    group: "notifications",
                    type: "success",
                    title: "Succès",
                    text: this.successNotificationWording
                });
                this.$store.state.towns.data.push(result.town);
            } catch (err) {
                this.loading = false;

                if (err && err.fields) {
                    this.$refs.form.setErrors(err.fields);
                }

                if (err && err.user_message) {
                    this.mainError =
                        (err && err.user_message) ||
                        "Une erreur inconnue est survenue";
                }

                this.$router.replace("#erreurs");
                return;
            }
        },

        async submitFn(data) {
            if (this.mode === "create") {
                const result = await add(data);
                this.$trackMatomoEvent(
                    "Site",
                    "Création site",
                    `S${result.town.id}`
                );
                return result;
            }

            this.$trackMatomoEvent(
                "Site",
                "Mise à jour site",
                `S${this.data.id}`
            );
            return edit(this.data.id, data);
        },
        showClosedTowns(closedTowns) {
            this.nearbyClosedShantytowns = closedTowns;
        },
        noAddressEntered(trueOrFalse) {
            this.noAddressProvided = trueOrFalse;
            if (trueOrFalse) {
                // On vide la liste des sites fermés
                this.nearbyClosedShantytowns = [];
                // On vide la liste des sites fermés déjà cochés
                this.town.people.location_shantytowns = [];
            }
        },
        swapIsReinstallation() {
            this.town.characteristics.is_reinstallation = null;
        },
        getDetailedClosedTown(id) {
            const town = id;
            return town;
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
