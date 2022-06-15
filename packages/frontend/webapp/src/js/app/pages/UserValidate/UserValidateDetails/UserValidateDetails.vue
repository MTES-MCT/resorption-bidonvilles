<template>
    <div>
        <div class="mb-2 text-lg font-bold">
            <h1>{{ user.last_name.toUpperCase() }} {{ user.first_name }}</h1>
        </div>

        <UserValidateDetailsLabel label="Structure :" class="mb-2">
            <router-link
                class="text-primary"
                :to="'/annuaire/' + user.organization.id"
            >
                <div v-if="user.organization.abbreviation">
                    {{ user.organization.abbreviation }} ({{
                        user.organization.name
                    }})
                </div>
                <div v-else>{{ user.organization.name }}</div>
            </router-link>
        </UserValidateDetailsLabel>

        <UserValidateDetailsLabel
            label="Territoire d'intervention :"
            class="mb-2"
        >
            <strong>{{ territory }}</strong>
        </UserValidateDetailsLabel>

        <UserValidateDetailsLabel label="Fonction :" class="mb-2">
            <strong>{{ user.position }}</strong>
        </UserValidateDetailsLabel>

        <UserValidateDetailsContact icon="envelope"
            ><Link
                :to="`mailto:${user.email}`"
                @click.native.stop="
                    $trackMatomoEvent('Mail', 'Envoi mail entre utilisateurs')
                "
                >{{ user.email }}</Link
            ></UserValidateDetailsContact
        >

        <UserValidateDetailsContact v-if="user.phone" icon="phone">{{
            user.phone
        }}</UserValidateDetailsContact>
    </div>
</template>

<script>
import UserValidateDetailsLabel from "./UserValidateDetailsLabel";
import UserValidateDetailsContact from "./UserValidateDetailsContact";

export default {
    components: {
        UserValidateDetailsLabel,
        UserValidateDetailsContact
    },
    props: {
        user: {
            type: Object
        }
    },
    computed: {
        territory() {
            if (this.user.organization.location.type === "nation") {
                return "National";
            }

            return this.user.organization.location[
                this.user.organization.location.type
            ].name;
        }
    }
};
</script>
