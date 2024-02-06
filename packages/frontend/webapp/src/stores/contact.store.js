import { defineStore } from "pinia";
import { getTypes, getOrganizations } from "@/api/organization_categories.api";

export const useContactStore = defineStore("contact", {
    state: () => ({
        public_establishment_types: [],
        associations: [],
        administrations: [],
    }),
    actions: {
        async fetchPublicEstablishmentTypes() {
            const response = await getTypes("public_establishment");
            this.public_establishment_types = response.types;
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
        async fetchAdministrations() {
            const response = await getOrganizations("administration");
            this.administrations = response.organizations;
        },
    },
});
