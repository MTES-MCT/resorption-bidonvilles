import Skeleton from "#app/layouts/skeleton/skeleton.vue";
import Table from "#app/components/table/table.vue";
import Organization from "#app/components/organization/organization.vue";
import OrganizationInput from "#app/components/form/input/organization/organization.vue";
import { getDirectory } from "#helpers/api/user";
import { directoryViews } from "#helpers/api/statistics";
import { get as getConfig } from "#helpers/api/config";

export default {
    components: {
        Skeleton,
        Table,
        Organization,
        OrganizationInput
    },

    data() {
        return {
            organizations: [],
            columns: [
                { id: "organization", label: "Structure" },
                { id: "location", label: "Territoire" },
                { id: "role", label: "Rôle" },
                { id: "contacts", label: "", icon: "arrow-right" }
            ],
            local: getConfig().user.organization.location,
            level: "local",
            search: null
        };
    },

    computed: {
        localIsNational() {
            return this.local.type === "nation";
        },

        parsedOrganizations() {
            let filtered = [];

            if (this.localIsNational || this.level === "national") {
                filtered = this.organizations;
            } else {
                filtered = this.organizations.filter(organization => {
                    const a = this.local[this.local.type];
                    const b = organization.location[this.local.type];
                    return a && b && a.code === b.code;
                });
            }

            return filtered.map(organization => {
                // organization
                let organizationName;
                if (organization.type.abbreviation !== null) {
                    organizationName = `${organization.type.abbreviation} (${organization.name})`;
                } else if (organization.abbreviation !== null) {
                    organizationName = `${organization.abbreviation} (${organization.name})`;
                } else {
                    organizationName = organization.name;
                }

                // location
                let locationName;
                if (organization.location.type === "nation") {
                    locationName = "National";
                } else {
                    const location =
                        organization.location[organization.location.type];
                    if (!location) {
                        locationName = "";
                    } else if (organization.location.type === "departement") {
                        locationName = `${location.name} (${location.code})`;
                    } else {
                        locationName = location.name;
                    }
                }

                return {
                    id: organization.id,
                    organization: organizationName,
                    location: locationName,
                    role: `<span class="role">${organization.role}</span>`,
                    contacts:
                        organization.users.length > 0
                            ? `<span class="link">${
                                  organization.users.length
                              } contact${
                                  organization.users.length > 1 ? "s" : ""
                              }</span>`
                            : "",
                    raw: {
                        id: organization.id,
                        name: organizationName,
                        location: organization.location,
                        locationName,
                        role: organization.role,
                        users: organization.users
                    }
                };
            });
        },

        filteredOrganizations() {
            if (this.search === null) {
                return this.parsedOrganizations;
            }

            let filter;
            switch (this.search.data.type.id) {
                case "user":
                    filter = ({ id }) => id === this.search.data.organization;
                    break;
                case "location":
                    filter = ({ raw: { location } }) =>
                        location[this.search.data.location_type] &&
                        location[this.search.data.location_type].code ===
                            this.search.data.id;
                    break;
                case "organization":
                    filter = ({ id }) => id === this.search.data.id;
                    break;
                default:
                    filter = () => false;
            }

            return this.parsedOrganizations.filter(filter);
        },

        focusedOrganization() {
            if (!this.$route.params.id) {
                return null;
            }

            const organization = this.parsedOrganizations.find(
                ({ id }) => id === parseInt(this.$route.params.id, 10)
            );
            if (organization === undefined) {
                return null;
            }

            return organization.raw;
        },

        pageContent() {
            return this.filteredOrganizations.slice(
                this.pageBeginning - 1,
                this.pageEnd
            );
        },

        usersTotal() {
            return this.filteredOrganizations.reduce(
                (total, org) => total + org.raw.users.length,
                0
            );
        }
    },

    watch: {
        focusedOrganization() {
            if (this.focusedOrganization !== null) {
                directoryViews(this.focusedOrganization.id);
            }
        }
    },

    methods: {
        loader: getDirectory,

        onLoaded({ organizations }) {
            this.organizations = organizations;
        },

        setLevel(level) {
            if (this.level === level) {
                return;
            }

            this.level = level;
        },

        focus({ raw: organization }) {
            this.$router.push(`/annuaire/${organization.id}`);
        },

        resetFocusedOrganization() {
            this.$router.push("/annuaire");
        }
    }
};
