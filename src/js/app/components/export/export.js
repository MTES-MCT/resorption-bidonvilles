import { open } from "#helpers/api/main";
import { getPermission } from "#helpers/api/config";

export default {
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
                    label: "Informations d'accès au site",
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
            options: {
                priority: false,
                address_details: false,
                demographics: false,
                life_conditions: false,
                justice: false,
                owner: false,
                comments: false,
                covid_comments: false
            }
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
    mounted() {
        document.addEventListener("click", this.checkOutsideClick);
    },
    destroyed() {
        document.removeEventListener("click", this.checkOutsideClick);
    },
    methods: {
        checkOutsideClick(event) {
            // ignore the origin event
            if (this.$refs.wrapper.offsetHeight === 0) {
                return;
            }

            if (!this.$refs.wrapper.contains(event.target)) {
                this.close();
            }
        },
        download() {
            const { code, type } = this.location.data;
            let url = `${
                process.env.VUE_APP_API_URL
            }/towns/export?locationType=${encodeURIComponent(
                type
            )}&locationCode=${encodeURIComponent(code)}&closedTowns=${
                this.closedTowns ? "1" : "0"
            }`;

            const options = this.availableOptions
                .map(({ id }) => id)
                .filter(id => this.options[id]);
            if (options.length > 0) {
                url += `&options=${encodeURIComponent(options.join(","))}`;
            }

            open(url);
        },
        close() {
            this.$emit("close");
        }
    }
};
