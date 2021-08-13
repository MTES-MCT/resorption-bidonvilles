<template>
    <div
        :class="[
            'rounded-sm cursor-pointer border preventPrintBreak',
            isHover ? 'bg-blue200 border-transparent' : ''
        ]"
        @mouseenter="isHover = true"
        @mouseleave="isHover = false"
    >
        <router-link :to="`annuaire/${organization.id}`">
            <div class="p-4 flex">
                <div class="text-md font-bold w-2/3 pr-16">
                    {{ organization.name }} {{ territory }}
                </div>
                <ul class="w-1/3 list-disc">
                    <li
                        v-for="user in organization.users.slice(0, 5)"
                        :key="user.id"
                    >
                        {{ user.last_name.toUpperCase() }} {{ user.first_name }}
                    </li>
                    <li v-if="organization.users.length > 5">
                        +{{ organization.users.length }} contacts
                    </li>
                </ul>
            </div>
        </router-link>
    </div>
</template>

<script>
export default {
    props: {
        organization: {
            type: Object
        }
    },
    data() {
        return {
            isHover: false
        };
    },
    computed: {
        territory() {
            // Only display territory for associations
            if (this.organization.type.id === 8) {
                return `- ${this.organization.locationName}`;
            }

            return ``;
        }
    }
};
</script>
