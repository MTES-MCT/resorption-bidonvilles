<template>
    <ValidationObserver ref="form" @submit.prevent="submit" v-slot="{ errors }">
        <form>
            <div class="bg-G100 py-8">
                <PrivateContainer class="flex justify-between items-baseline">
                    <div class="text-display-lg">
                        Renseigner des indicateurs<br /><span class="text-md">{{
                            data.name
                        }}</span>
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
                    defaultSection="date"
                    ref="leftColumn"
                />
                <div class="flex-1">
                    <PlanMarksFormPanelInfo
                        v-if="showInfo"
                        @close="closeInfo()"
                    ></PlanMarksFormPanelInfo>

                    <FormErrorLog
                        id="erreurs"
                        class="mt-8 mb-8"
                        :mainError="mainError"
                        :errors="errors"
                    ></FormErrorLog>

                    <PlanMarksFormPanelDate
                        class="mt-10 panelShadow"
                        id="date"
                        v-model="state.date"
                        :plan="data"
                    ></PlanMarksFormPanelDate>

                    <PlanMarksFormPanelAudience
                        class="mt-10 panelShadow"
                        id="audience"
                        v-if="state.date"
                        v-model="state.audience"
                        :plan="data"
                    ></PlanMarksFormPanelAudience>

                    <PlanMarksFormPanelTeam
                        class="mt-10 panelShadow"
                        id="team"
                        v-if="state.date"
                        v-model="state.etp"
                        :plan="data"
                    ></PlanMarksFormPanelTeam>

                    <PlanMarksFormPanelDroitsCommuns
                        class="mt-10 panelShadow"
                        id="droits_communs"
                        v-if="state.date"
                        v-model="state.droits_communs"
                        :plan="data"
                    ></PlanMarksFormPanelDroitsCommuns>

                    <PlanMarksFormPanelSante
                        class="mt-10 panelShadow"
                        id="sante"
                        v-if="state.date && topics.includes('health')"
                        v-model="state.sante"
                        :plan="data"
                    ></PlanMarksFormPanelSante>

                    <PlanMarksFormPanelEducation
                        class="mt-10 panelShadow"
                        id="education"
                        v-if="state.date && topics.includes('school')"
                        v-model="state.education"
                        :plan="data"
                    ></PlanMarksFormPanelEducation>

                    <PlanMarksFormPanelEmploi
                        class="mt-10 panelShadow"
                        id="emploi"
                        v-if="state.date && topics.includes('work')"
                        v-model="state.emploi"
                        :plan="data"
                    ></PlanMarksFormPanelEmploi>

                    <PlanMarksFormPanelLogement
                        class="mt-10 panelShadow"
                        id="logement"
                        v-if="state.date && topics.includes('housing')"
                        v-model="state.logement"
                        :plan="data"
                    ></PlanMarksFormPanelLogement>

                    <PlanMarksFormPanelSecurite
                        class="mt-10 panelShadow"
                        id="securite"
                        v-if="state.date && topics.includes('safety')"
                        v-model="state.securite"
                        :plan="data"
                    ></PlanMarksFormPanelSecurite>

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
.panelShadow {
    box-shadow: 0 0px 20px 0 rgba(0, 0, 0, 0.1), 0 0px 0px 0 rgba(0, 0, 0, 0.06);
    border-radius: 5px;
}
</style>

<script>
import PrivateContainer from "#app/components/PrivateLayout/PrivateContainer";
import PlanMarksFormPanelInfo from "./PlanMarksFormPanelInfo";
import PlanMarksFormPanelDate from "./PanelDate/PlanMarksFormPanelDate";
import PlanMarksFormPanelAudience from "./PanelAudience/PlanMarksFormPanelAudience";
import PlanMarksFormPanelTeam from "./PanelTeam/PlanMarksFormPanelTeam";
import PlanMarksFormPanelDroitsCommuns from "./PanelDroitsCommuns/PlanMarksFormPanelDroitsCommuns";
import PlanMarksFormPanelSante from "./PanelSante/PlanMarksFormPanelSante";
import PlanMarksFormPanelEducation from "./PanelEducation/PlanMarksFormPanelEducation";
import PlanMarksFormPanelEmploi from "./PanelEmploi/PlanMarksFormPanelEmploi";
import PlanMarksFormPanelLogement from "./PanelLogement/PlanMarksFormPanelLogement";
import PlanMarksFormPanelSecurite from "./PanelSecurite/PlanMarksFormPanelSecurite";
import FormLeftColumn from "#app/components/ui/Form/FormLeftColumn";
import FormErrorLog from "#app/components/ui/Form/FormErrorLog";
import { addState } from "#helpers/api/plan";
import { notify } from "#helpers/notificationHelper";

export default {
    props: {
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
        PlanMarksFormPanelInfo,
        PlanMarksFormPanelDate,
        PlanMarksFormPanelAudience,
        PlanMarksFormPanelTeam,
        PlanMarksFormPanelDroitsCommuns,
        PlanMarksFormPanelSante,
        PlanMarksFormPanelEducation,
        PlanMarksFormPanelEmploi,
        PlanMarksFormPanelLogement,
        PlanMarksFormPanelSecurite
    },

    data() {
        const states = this.data.states || [];
        const lastState = states.length > 0 ? states.slice(-1)[0] : null;

        return {
            mainError: null,
            loading: false,
            showInfo: true,
            state: {
                date: null,
                audience: {},
                etp:
                    lastState !== null
                        ? lastState.etp.map(({ type, total }) => ({
                              type: type.uid,
                              total
                          }))
                        : [],
                droits_communs: {
                    domiciliation: null,
                    droits_caf: null,
                    emploi_stable: null
                },
                sante: {
                    ame_valide: null,
                    ame_en_cours: null,
                    puma_valide: null,
                    puma_en_cours: null,
                    orientation: null,
                    accompagnement: null
                },
                education: {
                    scolarisables: null,
                    en_mediation: null,
                    maternelles: null,
                    elementaires: null,
                    colleges: null,
                    lycees: null,
                    difficultes: ["cantine", "place_up2a", "transport"].filter(
                        d => {
                            return (
                                lastState &&
                                lastState.education &&
                                (lastState.education[`difficulte_${d}`] ||
                                    lastState.education[`difficculte_${d}`])
                            );
                        }
                    )
                },
                emploi: {
                    pole_emploi: null,
                    pole_emploi_femmes: null,
                    mission_locale: null,
                    mission_locale_femmes: null,
                    contrats: null,
                    contrats_femmes: null,
                    formations: null,
                    formations_femmes: null,
                    autoentrepreneurs: null,
                    autoentrepreneurs_femmes: null,
                    are: null,
                    are_femmes: null
                },
                logement: {
                    dalo: {
                        families: null,
                        people: null
                    },
                    logement_social: {
                        families: null,
                        people: null
                    },
                    siao: {
                        families: null,
                        people: null
                    },
                    accompagnes: {
                        families: null,
                        people: null
                    },
                    non_accompagnes: {
                        families: null,
                        people: null
                    },
                    heberges: {
                        families: null,
                        people: null
                    }
                },
                securite: {
                    points_eau: null,
                    electricite: null,
                    wc: null,
                    nombre_bennes: null
                }
            }
        };
    },

    computed: {
        topics() {
            return this.data.topics.map(({ uid }) => uid);
        },
        sections() {
            const s = [{ id: "date", label: "Date d'actualisation" }];

            if (this.state.date) {
                s.push(
                    ...[
                        { id: "audience", label: "Entrées et sorties" },
                        { id: "team", label: "Équipe" },
                        {
                            id: "droits_communs",
                            label: "Droits communs et ressources"
                        }
                    ]
                );

                if (this.topics.includes("health")) {
                    s.push({ id: "sante", label: "Santé" });
                }

                if (this.topics.includes("work")) {
                    s.push({ id: "emploi", label: "Formation et emploi" });
                }

                if (this.topics.includes("housing")) {
                    s.push({ id: "logement", label: "Logement" });
                }

                if (this.topics.includes("safety")) {
                    s.push({
                        id: "securite",
                        label: "Stabilisation et sécurisation du site"
                    });
                }
            }

            return s;
        }
    },

    watch: {
        ["state.date"]() {
            // quand une date est saisie, des rubriques deviennent visibles et doivent être observées
            this.$refs.leftColumn.observe();

            // quand le champ date est vidé, des erreurs sont générées pour des champs qui disparaissent
            // on retirer ces erreurs avec le reset
            this.$refs.form.reset();
        }
    },

    methods: {
        back() {
            this.$router.replace(`/dispositif/${this.data.id}`);
        },

        closeInfo() {
            this.showInfo = false;
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
                await this.submitFn({
                    date: this.state.date,
                    etp: this.state.etp,
                    audience: this.state.audience,
                    ...this.state.droits_communs,
                    ...(this.topics.includes("health") ? this.state.sante : {}),
                    ...(this.topics.includes("housing")
                        ? this.state.logement
                        : {}),
                    ...(this.topics.includes("safety")
                        ? this.state.securite
                        : {}),
                    ...(this.topics.includes("school")
                        ? this.state.education
                        : {}),
                    ...(this.topics.includes("work") ? this.state.emploi : {})
                });

                this.loading = false;
                this.$router.push(`/dispositif/${this.data.id}`);

                notify({
                    group: "notifications",
                    type: "success",
                    title: "Succès",
                    text: "Les indicateurs ont bien été enregistrés"
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
            const result = await addState(this.data.id, data);
            this.$trackMatomoEvent(
                "Dispositif",
                "Mise à jour indicateurs",
                `D${this.data.id}`
            );
            return result;
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
