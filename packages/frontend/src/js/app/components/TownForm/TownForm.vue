<template>
    <ValidationObserver ref="form" @submit.prevent="submit" v-slot="{ errors }">
        <form>
            <div class="bg-G100 py-8">
                <PrivateContainer class="flex justify-between items-baseline">
                    <div class="text-display-lg">{{ submitWording }}</div>
                    <div>
                        <Button variant="primaryText" @click="back"
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
                <TownFormLeftColumn class="leftColumnWidth" />
                <div class="flex-1">
                    <TownFormPanelInfo
                        v-if="showInfo"
                        @close="closeInfo()"
                    ></TownFormPanelInfo>

                    <TownFormErrorLog
                        id="erreurs"
                        class="mt-8 mb-8"
                        :mainError="mainError"
                        :errors="errors"
                    ></TownFormErrorLog>

                    <TownFormPanelLocation
                        class="mt-10"
                        v-model="town.location"
                    ></TownFormPanelLocation>

                    <TownFormPanelCharacteristics
                        class="mt-10 townPanelShadow"
                        id="characteristics"
                        v-model="town.characteristics"
                    ></TownFormPanelCharacteristics>

                    <TownFormPanelPeople
                        class="mt-10 townPanelShadow"
                        id="people"
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
                    ></TownFormPanelJudicial>

                    <div class="mt-8 text-right italic text-red font-bold">
                        * : Réponses obligatoires
                    </div>
                </div>
            </PrivateContainer>

            <div class="pt-12 pb-16">
                <PrivateContainer class="flex justify-end items-baseline">
                    <Button variant="primaryText" @click="back">Annuler</Button>
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
import TownFormLeftColumn from "./TownFormLeftColumn";
import TownFormErrorLog from "./TownFormErrorLog";
import { get as getConfig } from "#helpers/api/config";
import { add, edit } from "#helpers/api/town";
import { notify } from "#helpers/notificationHelper";

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
        TownFormLeftColumn,
        TownFormErrorLog,
        TownFormPanelInfo,
        TownFormPanelLocation,
        TownFormPanelCharacteristics,
        TownFormPanelPeople,
        TownFormPanelLivingConditions,
        TownFormPanelJudicial
    },

    data() {
        const { field_types: fieldTypes, user } = getConfig();

        return {
            mainError: null,
            loading: false,
            showInfo: true,
            town: {
                location: {
                    address: {
                        label: this.data.address
                            ? this.data.address
                            : undefined,
                        citycode: this.data.city
                            ? this.data.city.code
                            : undefined
                    },
                    name: this.data.name || undefined,
                    coordinates: this.data.latitude
                        ? [this.data.latitude, this.data.longitude]
                        : undefined
                },
                characteristics: {
                    built_at: this.data.builtAt
                        ? new Date(this.data.builtAt * 1000)
                        : undefined,
                    declared_at: this.data.declaredAt
                        ? new Date(this.data.declaredAt * 1000)
                        : undefined,
                    field_type: this.data.fieldType
                        ? this.data.fieldType.id
                        : undefined,
                    detailed_address: this.data.addressDetails,
                    owner_type: this.data.ownerType
                        ? this.data.ownerType.id
                        : undefined,
                    owner: this.data.owner
                },
                people: {
                    population: {
                        populationTotal: this.intToStr(
                            this.data.populationTotal
                        ),
                        populationCouples: this.intToStr(
                            this.data.populationCouples
                        ),
                        populationMinors: this.intToStr(
                            this.data.populationMinors
                        )
                    },
                    populationMinors: {
                        populationMinors0To3: this.intToStr(
                            this.data.populationMinors0To3
                        ),
                        populationMinors3To6: this.intToStr(
                            this.data.populationMinors3To6
                        ),
                        populationMinors6To12: this.intToStr(
                            this.data.populationMinors6To12
                        ),
                        populationMinors12To16: this.intToStr(
                            this.data.populationMinors12To16
                        ),
                        populationMinors16To18: this.intToStr(
                            this.data.populationMinors16To18
                        ),
                        minorsInSchool: this.intToStr(this.data.minorsInSchool)
                    },
                    social_origins: this.data.socialOrigins
                        ? this.data.socialOrigins.map(({ id }) => id)
                        : [],
                    census_status: this.toNullableStr(this.data.censusStatus),
                    census_conducted_at: this.data.censusConductedAt
                        ? new Date(this.data.censusConductedAt * 1000)
                        : undefined,
                    census_conducted_by: this.data.censusConductedBy
                },
                living_conditions: {
                    access_to_water: this.boolToInt(this.data.accessToWater),
                    water_comments: this.data.waterComments || undefined,
                    electricity_type: this.data.electricityType
                        ? this.data.electricityType.id
                        : undefined,
                    electricity_comments:
                        this.data.electricityComments || undefined,
                    access_to_sanitary: this.boolToInt(
                        this.data.accessToSanitary
                    ),
                    sanitary_comments: this.data.sanitaryComments || undefined,
                    trash_evacuation: this.boolToInt(this.data.trashEvacuation),
                    water_potable: this.boolToInt(this.data.waterPotable),
                    water_public_point: this.boolToInt(
                        this.data.waterPublicPoint
                    ),
                    water_continuous_access: this.boolToInt(
                        this.data.waterContinuousAccess
                    ),
                    water_distance: this.data.waterDistance,
                    water_roads_to_cross: this.boolToInt(
                        this.data.waterRoadsToCross
                    ),
                    water_everyone_has_access: this.boolToInt(
                        this.data.waterEveryoneHasAccess
                    ),
                    water_stagnant_water: this.boolToInt(
                        this.data.waterStagnantWater
                    ),
                    water_hand_wash_access: this.boolToInt(
                        this.data.waterHandWashAccess
                    ),
                    water_hand_wash_access_number: this.data
                        .waterHandWashAccessNumber,
                    sanitary_number: this.data.sanitaryNumber,
                    sanitary_insalubrious: this.boolToInt(
                        this.data.sanitaryInsalubrious
                    ),
                    sanitary_on_site: this.boolToInt(this.data.sanitaryOnSite),
                    trash_cans_on_site: this.data.trashCansOnSite,
                    trash_accumulation: this.boolToInt(
                        this.data.trashAccumulation
                    ),
                    trash_evacuation_regular: this.boolToInt(
                        this.data.trashEvacuationRegular
                    ),
                    vermin: this.boolToInt(this.data.vermin),
                    vermin_comments: this.data.verminComments,
                    fire_prevention_measures: this.boolToInt(
                        this.data.firePreventionMeasures
                    ),
                    fire_prevention_diagnostic: this.boolToInt(
                        this.data.firePreventionDiagnostic
                    ),
                    fire_prevention_devices: this.boolToInt(
                        this.data.firePreventionDevices
                    ),
                    fire_prevention_site_accessible: this.boolToInt(
                        this.data.firePreventionSiteAccessible
                    ),
                    fire_prevention_comments: this.data.firePreventionComments
                },
                judicial: {
                    owner_complaint: this.boolToInt(this.data.ownerComplaint),
                    justice_procedure: this.boolToInt(
                        this.data.justiceProcedure
                    ),
                    justice_rendered: this.boolToInt(this.data.justiceRendered),
                    justice_rendered_at: this.data.justiceRenderedAt
                        ? new Date(this.data.justiceRenderedAt * 1000)
                        : undefined,
                    justice_rendered_by:
                        this.data.justiceRenderedBy || undefined,
                    justice_challenged: this.boolToInt(
                        this.data.justiceChallenged
                    ),
                    police_status: this.toNullableStr(this.data.policeStatus),
                    police_requested_at: this.data.policeRequestedAt
                        ? new Date(this.data.policeRequestedAt * 1000)
                        : undefined,
                    police_granted_at: this.data.policeGrantedAt
                        ? new Date(this.data.policeGrantedAt * 1000)
                        : undefined,
                    bailiff: this.data.bailiff || undefined
                }
            },
            fieldTypes,
            user
        };
    },

    computed: {
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
        }
    },

    methods: {
        back() {
            this.$router.replace(this.backPage);
        },

        closeInfo() {
            this.showInfo = false;
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

        intToStr(int) {
            if (typeof int === "number") {
                return `${int}`;
            }

            return undefined;
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

        toNullableStr(value) {
            if (value === undefined || value === null) {
                return "null";
            }

            return value;
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
