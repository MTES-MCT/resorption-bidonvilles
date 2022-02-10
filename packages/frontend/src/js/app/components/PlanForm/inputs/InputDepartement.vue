<template>
    <Select
        id="departement"
        label=""
        validationName="Département d'intervention principal"
        rules="required"
        v-model="input"
        :disabled="disabled"
    >
        <SelectOption>- Selectionner un choix -</SelectOption>
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
        },
        disabled: {
            type: Boolean,
            required: false,
            default: false
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

            if (this.permission.allow_all === true) {
                return this.departements;
            } else {
                return [
                    ...this.getFullDepartementsFor(
                        this.permission.allowed_on.departements
                    ),
                    ...this.getDepartementsOfRegions(
                        this.permission.allowed_on.regions
                    )
                ];
            }
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
