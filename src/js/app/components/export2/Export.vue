<template>
    <Modal
        :isOpen="true"
        :closeModal="close"
        closeClickOutside
        class="modalContainer"
    >
        <template v-slot:header>
            <div
                class="pt-10 px-10 pb-4 flex justify-between border-b border-G200"
            >
                <div class="text-primary">
                    <div class="text-display-md text-primary">
                        Exporter les sites existants
                    </div>
                    <div class="font-bold mt-2">{{ location.label }}</div>
                </div>
                <div class="ml-16">
                    <Button variant="primaryText" @click="close">
                        Annuler</Button
                    >
                    <Button @click="download" class="ml-6">Exporter</Button>
                </div>
            </div>
        </template>
        <template v-slot:body>
            <div>
                <div class="font-bold mb-1">
                    Les données exportées par défaut
                </div>
                <ul>
                    <li>- Localisation : département, commune, adresse</li>
                    <li>
                        - Site : type de site (terrain / bâti), date
                        d’installation, date de signalement
                    </li>
                    <li>
                        - Habitants : nombre de personnes, mineurs, ménages et
                        origines
                    </li>
                    <li v-if="closedTowns">
                        - Orientations des ménages après la fermeture
                    </li>
                    <li>- Date de la dernière mise à jour</li>
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
import { open } from "#helpers/api/main";
import { getPermission } from "#helpers/api/config";
import Checkbox from "#app/components/ui/Form/input/Checkbox";

export default {
    components: { Checkbox },
    props: {
        location: Object,
        closedTowns: Boolean
    },
    data() {
        return {
            existingOptions: [
                {
                    id: "priority",
                    label: "Priorité",
                    description: "(1, 2, 3)",
                    closedTowns: false
                },
                {
                    id: "address_details",
                    label: "Informations d'accès au site et coordonnées GPS",
                    closedTowns: false
                },
                {
                    id: "owner",
                    label: "Propriétaire",
                    description: ": type et identité"
                },
                {
                    id: "life_conditions",
                    label: "Conditions de vie",
                    description:
                        ": accès à l'électricité, l'eau, toilettes, évacuation des déchets"
                },
                {
                    id: "demographics",
                    label: "Diagnostic",
                    description: ": statut, date, et service en charge"
                },
                {
                    id: "justice",
                    label: "Procédures judiciaires",
                    description: ": statut et date des étapes",
                    permission: {
                        entity: "shantytown",
                        feature: "export",
                        data: "justice"
                    }
                },
                {
                    id: "comments",
                    label: "Commentaires",
                    description: ": les 5 derniers",
                    permission: {
                        entity: "shantytown_comment",
                        feature: "list",
                        data: null
                    }
                },
                {
                    id: "covid_comments",
                    label: "Commentaires Covid-19",
                    permission: {
                        entity: "covid_comment",
                        feature: "list",
                        data: null
                    }
                }
            ],
            options: []
        };
    },
    computed: {
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

                    const p = getPermission(
                        `${permission.entity}.${permission.feature}`
                    );
                    if (p === null) {
                        return false;
                    }

                    return (
                        permission.data === null ||
                        p[`data_${permission.data}`] === true
                    );
                });
        }
    },
    methods: {
        download() {
            const { code, type } = this.location.data;
            let url = `${
                process.env.VUE_APP_API_URL
            }/towns/export?locationType=${encodeURIComponent(
                type
            )}&locationCode=${encodeURIComponent(code)}&closedTowns=${
                this.closedTowns ? "1" : "0"
            }`;

            if (this.options.length > 0) {
                url += `&options=${encodeURIComponent(this.options.join(","))}`;
            }

            open(url);
        },
        close() {
            this.$emit("close");
        }
    }
};
</script>
