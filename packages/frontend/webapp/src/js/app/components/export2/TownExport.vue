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
                        Exporter la fiche du site
                    </div>
                    <div class="font-bold mt-2">{{ townLabel }}</div>
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
            <div class="mt-4">
                <div class="font-bold mb-1">
                    Les données exportées par défaut
                </div>
                <ul>
                    <li>- Adresse et nom du site</li>
                    <li>
                        - Caractéristiques du site
                    </li>
                    <li>
                        - Habitants
                    </li>
                    <li>- Conditions de vie</li>
                </ul>
            </div>
            <div class="mt-4">
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
import Checkbox from "#app/components/ui/Form/input/Checkbox";
import { getExports } from "#helpers/api/town";

export default {
    components: { Checkbox },
    props: {
        shantytownId: Number,
        townLabel: String
    },
    data() {
        return {
            canExportHistory: this.$store.getters["config/hasPermission"](
                "shantytown_history.export"
            ),
            existingOptions: [
                {
                    id: "actions",
                    label: "Actions sur le site"
                },
                {
                    id: "actors",
                    label: "Intervenants"
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
                    id: "comments",
                    label: "Commentaires",
                    permission: {
                        entity: "shantytown_comment",
                        feature: "list"
                    }
                },
                {
                    id: "history",
                    label: "Historique des modifications"
                }
            ],
            options: []
        };
    },
    computed: {
        user() {
            return this.$store.state.config.configuration.user;
        },

        availableOptions() {
            return this.existingOptions.filter(({ permission }) => {
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
            getExports(this.shantytownId, this.options);
            this.$trackMatomoEvent(
                "Export",
                "Export fiche site",
                `S${this.shantytownId}`
            );
        },
        close() {
            this.$emit("close");
        }
    }
};
</script>
