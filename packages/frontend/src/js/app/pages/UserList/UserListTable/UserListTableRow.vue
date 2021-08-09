<template>
    <div
        :class="['p-4 border-b', backgroundColor]"
        @mouseenter="isHover = true"
        @mouseleave="isHover = false"
    >
        <div>
            <div class="text-primary">
                {{ user.last_name.toUpperCase() }} {{ user.first_name }}
            </div>
            <div>{{ user.position }}</div>
            <div class="text-G600" v-if="user.last_access">
                Dernière connexion: {{ formatDate(user.last_access, "d M y") }}
            </div>
        </div>
        <div>
            {{ user.organization.abbreviation || user.organization.name }}
        </div>
        <div>
            {{ user.territory }}
        </div>
        <div>
            {{ user.role }}
        </div>
        <div>
            <div>
                <span :class="user.user_status.color">
                    <Icon :icon="user.user_status.icon" />
                    <span> {{ user.user_status.text }}</span>
                </span>
                <span>
                    le {{ formatDate(user.user_status.date, "d M y") }}
                </span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        user: {
            type: Object
        }
    },
    data() {
        return {
            isHover: false
        };
    },
    methods: {
        formatDate(...args) {
            return App.formatDate.call(App, ...args);
        }
    },
    computed: {
        backgroundColor() {
            if (this.user.user_status.type === "requested") {
                return this.isHover ? "bg-orange300" : "bg-orange200";
            }

            return this.isHover ? "bg-blue200" : "";
        }
    }
};
</script>
