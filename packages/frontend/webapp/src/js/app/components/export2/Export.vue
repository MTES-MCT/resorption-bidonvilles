<template>
    <Modal
        :isOpen="true"
        :closeModal="close"
        closeClickOutside
        class="modalContainer"
    >
        <template v-slot:header>
            <div
                class="pt-10 px-10 pb-4 flex justify-between border-b-1 border-G200"
            >
                <div class="text-primary">
                    <div class="text-display-md font-bold text-primary">
                        {{
                            closedTowns
                                ? "Exporter les sites fermés"
                                : "Exporter les sites existants"
                        }}
                    </div>
                    <div class="font-bold mt-2">{{ location.label }}</div>
                </div>
                <div class="ml-16">
                    <Button variant="primaryText" @click="close">
                        Annuler</Button
                    >
                    <Button
                        @click="download"
                        class="ml-6"
                        icon="file-excel"
                        iconPosition="left"
                        >Exporter</Button
                    >
                </div>
            </div>
        </template>
        <template v-slot:body>
            <DatepickerV2
                v-if="canExportHistory === true"
                id="export_at"
                width="w-64"
                label="Date d'export"
                info="Vous souhaitez exporter les données des sites à la date :"
                v-model="dateInput"
                :clearValue="today"
            ></DatepickerV2>

            <div class="mt-4">
                <div class="font-bold mb-1">
                    Les données exportées par défaut
                </div>
                <ul>
                    <li>- Localisation</li>
                    <li>
                        - Caractéristiques du site
                    </li>
                    <li>
                        - Habitants
                    </li>
                </ul>
            </div>
            <div v-if="showOptions" class="mt-4">
                <p class="font-bold mb-1">
                    Cochez les informations supplémentaires que vous souhaitez
                    exporter
                </p>

                <Checkbox
                    :key="option.id"
                    v-for="option in availableOptions"
                    :checkValue="option.id"
                    v-model="options"
                    :label="`${option.label} ${option.description || ''}`"
                />
            </div>
        </template>
    </Modal>
</template>

<script>
import { open } from "#helpers/api/main";
import Checkbox from "#app/components/ui/Form/input/Checkbox";
import { VUE_APP_API_URL } from "#src/js/env.js";
const moment = require("moment");

export default {
    components: { Checkbox },
    props: {
        location: Object,
        closedTowns: Boolean
    },
    data() {
        return {
            today: new Date(),
            canExportHistory: this.$store.getters["config/hasPermission"](
                "shantytown_history.export"
            ),
            existingOptions: [
                {
                    id: "address_details",
                    label: "Informations d'accès au site et coordonnées GPS",
                    closedTowns: false
                },
                {
                    id: "owner",
                    label: "Propriétaire",
                    permission: {
                        entity: "shantytown_owner",
                        feature: "access"
                    }
                },
                {
                    id: "life_conditions",
                    label: "Conditions de vie"
                },
                {
                    id: "demographics",
                    label: "Diagnostic"
                },
                {
                    id: "justice",
                    label: "Procédures judiciaires",
                    permission: {
                        entity: "shantytown_justice",
                        feature: "access"
                    }
                },
                {
                    id: "actors",
                    label: "Intervenants"
                },
                {
                    id: "comments",
                    label: "Commentaires",
                    description: ": les 5 derniers",
                    permission: {
                        entity: "shantytown_comment",
                        feature: "list"
                    }
                },
                {
                    id: "covid_comments",
                    label: "Commentaires Covid-19",
                    permission: {
                        entity: "covid_comment",
                        feature: "list"
                    }
                }
            ],
            dateInput: new Date(),
            options: []
        };
    },
    watch: {
        dateInput() {
            this.options = [];
        }
    },
    computed: {
        showOptions() {
            return (
                moment(this.dateInput).format("YYYY-MM-DD") ===
                moment(this.today).format("YYYY-MM-DD")
            );
        },
        user() {
            return this.$store.state.config.configuration.user;
        },
        title() {
            return this.closedTowns ? "fermés" : "existants";
        },
        availableOptions() {
            return this.existingOptions
                .filter(
                    ({ closedTowns }) =>
                        closedTowns === undefined ||
                        this.closedTowns === closedTowns
                )
                .filter(({ permission }) => {
                    if (permission === undefined) {
                        return true;
                    }

                    return (
                        this.$store.getters["config/getPermission"](
                            `${permission.entity}.${permission.feature}`
                        ) !== null
                    );
                });
        }
    },
    methods: {
        download() {
            const { code, type } = this.location.data;
            let url = `${VUE_APP_API_URL}/towns/export?locationType=${encodeURIComponent(
                type
            )}&locationCode=${encodeURIComponent(code)}&closedTowns=${
                this.closedTowns ? "1" : "0"
            }&date=${encodeURIComponent(this.dateInput.getTime())}`;

            if (this.options.length > 0) {
                url += `&options=${encodeURIComponent(this.options.join(","))}`;
            }

            open(url);
            this.$trackMatomoEvent("Export", "Export sites");
        },
        close() {
            this.$emit("close");
        }
    }
};
</script>
