<template>
    <div>
        <InputLabel
            label="Personne référente chez l'opérateur"
            :showMandatoryStar="true"
        />
        <p v-if="loaded === false" class="text-sm italic">
            <Spinner /> Chargement de la liste des membres de cet opérateur en
            cours
        </p>
        <p v-else-if="values.length === 0">
            <span class="text-red"
                >Il n'y a pas encore d'utilisateur enregistré sur la plateforme
                pour cet opérateur.</span
            ><br />
            <a
                href="#"
                v-if="$store.getters['config/hasPermission']('user.create')"
                @click="openUserCreationForm"
                class="link"
                >Vous pouvez créer un compte à cette personne en cliquant
                ici.</a
            >
        </p>
        <Select
            v-else
            id="contact"
            label=""
            validationName="Personne référente chez l'opérateur"
            rules="required"
            v-model="input"
            :disabled="disabled"
        >
            <SelectOption>- Selectionner un choix -</SelectOption>
            <SelectOption
                v-for="value in values"
                :key="value.value"
                :value="value.value"
                >{{ value.label }}</SelectOption
            >
        </Select>
    </div>
</template>

<script>
import InputLabel from "#app/components/ui/Form/utils/InputLabel.vue";
import { notify } from "#helpers/notificationHelper";
import { getMembers } from "#helpers/api/organization";

export default {
    props: {
        value: {
            type: [Number, String],
            required: false
        },
        associationId: {
            type: Number,
            required: true
        },
        associationName: {
            type: String,
            required: true
        },
        associationDepartement: {
            type: String,
            required: true
        },
        disabled: {
            type: Boolean,
            required: false,
            default: false
        }
    },

    components: {
        InputLabel
    },

    data() {
        return {
            loaded: false,
            input: this.value,
            values: []
        };
    },

    watch: {
        input() {
            this.$emit("input", this.input);
        },
        associationId() {
            this.load();
        },
        associationName() {
            this.load();
        },
        associationDepartement() {
            this.load();
        }
    },

    mounted() {
        window.addEventListener("message", this.onUserCreated, false);
        this.load();
    },

    unmounted() {
        window.removeEventListener("message", this.onUserCreated, false);
    },

    methods: {
        async load() {
            this.loaded = false;
            const { users } = await getMembers(this.associationId);
            this.values = users.map(
                ({ id, first_name: firstName, last_name: lastName }) => ({
                    value: id,
                    label: `${firstName} ${lastName.toUpperCase()}`
                })
            );
            this.loaded = true;
        },
        openUserCreationForm() {
            const { href } = this.$router.resolve("/nouvel-utilisateur");
            window.open(
                `${href}?association_name=${encodeURIComponent(
                    this.associationName
                )}&association_departement=${this.associationDepartement}`,
                "newUser",
                "menubar=no, status=no"
            );
        },
        onUserCreated({ data }) {
            if (!data.id || !data.first_name || !data.last_name) {
                return;
            }

            this.values.push({
                value: data.id,
                label: `${data.first_name} ${data.last_name.toUpperCase()}`
            });

            this.input = data.id;
            this.$emit("input", this.input);

            notify({
                group: "notifications",
                type: "success",
                title: "Utilisateur créé",
                text: "La personne référente est désormais sélectionnée"
            });
        }
    }
};
</script>
