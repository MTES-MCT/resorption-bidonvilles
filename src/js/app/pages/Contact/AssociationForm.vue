<template>
    <div>
        <Select
            label="Précisez le type de structure"
            :value="associationName"
            @input="val => $emit('update:associationName', val)"
            rules="required"
            id="association"
        >
            <optgroup label="Autre">
                <option value="Autre"
                    >Mon association n'est pas dans cette liste</option
                >
            </optgroup>
            <optgroup label="Associations connues">
                <option
                    v-for="item in associationNameOptions"
                    :key="item.value"
                    :value="item.value"
                    >{{ item.label }}</option
                >
            </optgroup>
        </Select>
        <div v-if="associationName === 'Autre'">
            <TextInput
                label="Précisez le nom complet"
                :value="newAssociationName"
                @input="val => $emit('update:newAssociationName', val)"
                rules="required"
                id="new_association_name"
            />
            <TextInput
                label="Précisez l'acronyme, si besoin"
                :value="newAssociationAcronym"
                @input="val => $emit('update:newAssociationAcronym', val)"
                id="new_association_abbreviation"
            />
        </div>
        <div>
            <Select
                label="Territoire de rattachement"
                :value="associationTerritory"
                @input="val => $emit('update:associationTerritory', val)"
                rules="required"
                id="departement"
            >
                <SelectOption>- Selectionner un choix -</SelectOption>
                <SelectOption
                    v-for="item in associationTerritoryOptions"
                    :key="item.value"
                    :value="item.value"
                >
                    {{ item.label }}
                </SelectOption>
            </Select>
        </div>

        <TextInput
            label="Votre fonction"
            :value="associationFunction"
            @input="val => $emit('update:associationFunction', val)"
            rules="required"
            id="position"
        />
    </div>
</template>

<script>
import { getByCategory as getOrganizationsByCategory } from "#helpers/api/organization";
import { departements as listDepartements } from "#helpers/addressHelper";

export default {
    props: {
        associationName: {
            required: true
        },
        associationTerritory: {
            required: true
        },
        associationFunction: {
            required: true
        },
        newAssociationName: {
            required: true
        },
        newAssociationAcronym: {
            required: true
        }
    },
    data() {
        return {
            associationNameOptions: [],
            associationTerritoryOptions: []
        };
    },
    async mounted() {
        const [
            { organizations: associations },
            { departements }
        ] = await Promise.all([
            getOrganizationsByCategory("association"),
            listDepartements()
        ]);

        const usedAssociations = [];
        this.associationNameOptions = associations
            .filter(association => {
                if (usedAssociations.indexOf(association.name) !== -1) {
                    return false;
                }

                usedAssociations.push(association.name);
                return true;
            })
            .map(({ name, abbreviation }) => ({
                value: name,
                label:
                    abbreviation !== null ? `${abbreviation} (${name})` : name
            }));

        this.associationTerritoryOptions = departements.map(
            ({ code, name }) => ({
                value: code,
                label: `${code} - ${name}`
            })
        );
    }
};
</script>
