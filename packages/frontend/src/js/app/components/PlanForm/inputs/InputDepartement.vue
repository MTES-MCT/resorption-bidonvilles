<template>
    <Select
        label=""
        id="departement"
        validationName="Département d'intervention principal"
        rules="required"
        v-model="input"
    >
        <SelectOption
            v-for="value in values"
            :key="value.code"
            :value="value.code"
            >{{ value.name }}</SelectOption
        >
    </Select>
</template>

<script>
import { get as getConfig, getPermission } from "#helpers/api/config";

export default {
    props: {
        value: {
            type: String,
            required: false,
            default: undefined
        }
    },

    data() {
        const { departements } = getConfig();

        return {
            departements,
            permission: getPermission("plan.create"),
            input: this.value
        };
    },

    computed: {
        values() {
            if (!this.permission) {
                return [];
            }

            // NEW-GEN PERMISSIONS:
            // ==
            // if (this.permission.allow_all === true) {
            //     return this.departements;
            // } else {
            //     return [
            //         ...this.getFullDepartementsFor(
            //             this.permission.allowed_on.departements
            //         ),
            //         ...this.getDepartementsOfRegions(
            //             this.permission.allowed_on.regions
            //         )
            //     ];
            // }

            // OLD-GEN PERMISSIONS
            // ==
            const { user } = getConfig();
            const userLevel = user.organization.location.type;

            // permission nationale
            if (
                this.permission.geographic_level === "nation" ||
                userLevel === "nation"
            ) {
                return this.departements;
            }

            // permission régionale
            if (userLevel === "region") {
                return this.getDepartementsOfRegions([
                    user.organization.location.region.code
                ]);
            }

            // permission départementale
            if (userLevel === "departement") {
                return [user.organization.location.departement];
            }

            // tout le reste
            return [];
        }
    },

    watch: {
        value() {
            this.input = this.value;
        },

        input() {
            this.$emit("input", this.input);
        }
    },

    methods: {
        getFullDepartementsFor(departements) {
            return this.departements.filter(({ code }) =>
                departements.includes(code)
            );
        },
        getDepartementsOfRegions(regions) {
            return this.departements.filter(({ region }) =>
                regions.includes(region)
            );
        }
    }
};
</script>
