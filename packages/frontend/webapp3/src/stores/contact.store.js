import { defineStore } from "pinia";
import { getTypes, getOrganizations } from "@/api/organization_categories.api";
import { get as getDepartements } from "@/api/departements.api";

export const useContactStore = defineStore("contact", {
    state: () => ({
        public_establishment_types: [],
        associations: [],
        departements: [],
        administrations: [],
    }),
    actions: {
        async fetchPublicEstablishmentTypes() {
            const response = await getTypes("public_establishment");
            this.public_establishment_types = response.types.filter(
                ({ numberOfOrganizations }) => numberOfOrganizations > 0
            );
        },
        async fetchAssociations() {
            const response = await getOrganizations("association");

            const associationNames = [];
            this.associations = response.organizations.filter((association) => {
                if (!associationNames.includes(association.name)) {
                    associationNames.push(association.name);
                    return true;
                }

                return false;
            });
        },
        async fetchDepartements() {
            const response = await getDepartements();
            this.departements = response.departements;
        },
        async fetchAdministrations() {
            const response = await getOrganizations("administration");
            this.administrations = response.organizations;
        },
    },
});
