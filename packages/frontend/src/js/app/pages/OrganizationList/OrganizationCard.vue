<template>
    <div
        :class="[
            'rounded-sm cursor-pointer border border-cardBorder preventPrintBreak',
            isHover ? 'bg-blue200 border-transparent' : ''
        ]"
        @mouseenter="isHover = true"
        @mouseleave="isHover = false"
    >
        <router-link :to="`/annuaire/${organization.id}`">
            <div class="p-4 grid grid-cols-4 auto-cols-max gap-4">
                <div class="text-md font-bold">
                    {{ name }}
                </div>
                <div v-if="!displayBeingFunded" class="text-md" />
                <div
                    v-if="displayBeingFunded"
                    class="text-md pl-4 sm:pl-8 lg:pl-32"
                >
                    <Icon icon="euro-sign" />
                </div>
                <ul class="pl-16">
                    <li
                        v-for="user in organization.users.slice(0, 5)"
                        :key="user.id"
                    >
                        {{ user.last_name.toUpperCase() }}
                        {{ user.first_name }}
                        <Icon
                            icon="user-shield"
                            class="text-info"
                            v-if="user.role === 'local_admin'"
                        />
                    </li>
                    <li v-if="organization.users.length > 5">
                        +{{ organization.users.length }} contacts
                    </li>
                </ul>
                <Button
                    variant="primaryText"
                    icon="arrow-right"
                    :class="[
                        'text-display-sm whitespace-no-wrap hover:underline -mb-4'
                    ]"
                    >{{ isHover ? "Voir la fiche complète" : "" }}</Button
                >
            </div>
        </router-link>
    </div>
</template>

<script>
import { get as getConfig } from "#helpers/api/config";

export default {
    props: {
        organization: {
            type: Object
        }
    },
    data() {
        const { user } = getConfig();
        return {
            isHover: false,
            currentUser: user
        };
    },
    computed: {
        name() {
            // Only display territory for associations
            if (this.organization.type.category === "association") {
                return `${this.organization.name} – ${this.organization.locationName}`;
            }

            if (this.organization.location.type === "nation") {
                return `${this.organization.name} – National`;
            }

            return this.organization.name.replace("-", "–");
        },
        displayBeingFunded() {
            if (
                this.currentUser.role_id === "national_admin" &&
                this.organization.being_funded
            ) {
                return true;
            }
            return false;
        }
    }
};
</script>
