<template>
    <CarteUtilisateurWrapper
        :user="user"
        :linkToUser="linkToUser"
        class="hover:bg-blue200 border p-4 grid grid-cols-2 gap-4"
        :class="{
            'bg-blue100': user.is_admin,
            [`${focusClasses.ring}`]: true,
        }"
    >
        <div>
            <h2 class="font-bold" :class="user.is_admin ? 'text-info' : ''">
                {{ user.last_name.toUpperCase() }}
                {{ user.first_name }}
            </h2>
            <p>{{ user.position }}</p>
            <p class="mt-2">
                <span class="text-G700 text-sm">Rôle sur la plateforme :</span
                ><br />
                <span :class="user.is_admin ? 'text-info' : ''"
                    ><IconeAdministrateur v-if="user.is_admin" />
                    {{ user.role }}</span
                >
            </p>
        </div>
        <div>
            <CarteUtilisateurDetailsIcon icon="envelope">
                <Link :to="`mailto:${user.email}`" @click="trackEmail">{{
                    user.email
                }}</Link>
            </CarteUtilisateurDetailsIcon>
            <CarteUtilisateurDetailsIcon v-if="user.phone" icon="phone">{{
                user.phone
            }}</CarteUtilisateurDetailsIcon>
        </div>
        <div
            v-if="user.expertise_topics?.length > 0"
            class="col-span-2 grid grid-cols-2 gap-4"
        >
            <div v-if="getTopicsByLevel('expertise').length > 0" class="flex">
                <Icon icon="arrow-turn-down-right" class="text-info mr-2" />
                <ul>
                    <span class="text-info">Expert(e) en</span>
                    <li
                        v-for="topic in getTopicsByLevel('expertise')"
                        :key="topic.uid"
                        class="text-G700 ml-2 text-sm"
                    >
                        - {{ topic.label }}
                    </li>
                </ul>
            </div>
            <div v-if="getTopicsByLevel('interest').length > 0" class="flex">
                <Icon icon="arrow-turn-down-right" class="text-info mr-2" />
                <ul>
                    <span class="text-info">Intéressé(e) par</span>
                    <li
                        v-for="topic in getTopicsByLevel('interest')"
                        :key="topic.uid"
                        class="text-G700 ml-2 text-sm"
                    >
                        - {{ topic.label }}
                    </li>
                </ul>
            </div>
        </div>
    </CarteUtilisateurWrapper>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import { trackEvent } from "@/helpers/matomo";
import focusClasses from "@common/utils/focus_classes";
import { Icon, Link } from "@resorptionbidonvilles/ui";
import CarteUtilisateurWrapper from "./CarteUtilisateurWrapper.vue";
import CarteUtilisateurDetailsIcon from "./CarteUtilisateurDetailsIcon.vue";
import IconeAdministrateur from "@/components/IconeAdministrateur/IconeAdministrateur.vue";

const props = defineProps({
    user: {
        type: Object,
        required: true,
    },
    linkToUser: {
        type: Boolean,
        required: false,
        default: true,
    },
});
const { user, linkToUser } = toRefs(props);

function trackEmail(event) {
    event.stopPropagation();
    trackEvent("Mail", "Envoi mail entre utilisateurs");
}

function getTopicsByLevel(level) {
    return (user.value.expertise_topics || []).filter(
        (topic) => topic.type === level
    );
}
</script>
