<template>
    <div>
        <FicheAccesColumnAccessDate
            :text="user.access_request_message ? 'Demandé' : 'Créé'"
            :date="user.created_at"
            icon="flag"
            color="text-redA11Y"
            class="mb-2"
        />
        <div v-for="(userAccess, index) in oldUserAccesses" v-bind:key="index">
            <FicheAccesColumnAccessDate
                text="Envoyé"
                :date="userAccess.created_at"
                icon="paper-plane"
                color="text-primary"
                class="mb-2"
            >
                <span v-if="userAccess.sent_by">
                    par {{ userAccess.sent_by.first_name }}
                    {{ userAccess.sent_by.last_name }}
                </span>
            </FicheAccesColumnAccessDate>

            <FicheAccesColumnAccessDate
                v-if="userAccess.isExpired"
                text="Expiré"
                :date="userAccess.expires_at"
                icon="unlink"
                color="text-G700"
                class="mb-2"
            />
        </div>

        <FicheAccesColumnAccessDate
            v-if="
                user.user_accesses.length > 0 &&
                !user.user_accesses[0].refused_at
            "
            text="Envoyé"
            :date="user.user_accesses[0].created_at"
            icon="paper-plane"
            color="text-primary"
            class="mb-2"
        >
            <span v-if="user.user_accesses[0].sent_by">
                par {{ user.user_accesses[0].sent_by.first_name }}
                {{ user.user_accesses[0].sent_by.last_name }}
            </span>
        </FicheAccesColumnAccessDate>

        <FicheAccesColumnAccessDate
            v-if="hasExpired(0)"
            text="Expiré"
            :date="user.user_accesses[0].expires_at"
            icon="unlink"
            color="text-G700"
            class="mb-2"
        />

        <FicheAccesColumnAccessDate
            v-if="
                user.user_accesses.length > 0 &&
                user.user_accesses[0].refused_at
            "
            text="Classé sans suite"
            :date="user.user_accesses[0].refused_at"
            icon="ban"
            color="text-G700"
            class="mb-2"
        />

        <FicheAccesColumnAccessDate
            v-if="
                user.user_accesses.length > 0 && user.user_accesses[0].used_at
            "
            text="Activé"
            :date="user.user_accesses[0].used_at"
            icon="user-check"
            color="text-tertiaryA11Y"
            class="mb-2"
        />

        <FicheAccesColumnAccessDate
            v-if="user.last_access && userStore.user?.is_admin"
            text="Dernière connexion"
            :date="user.last_access"
            icon="chalkboard-teacher"
            color="text-g600"
            class="mb-2"
        />

        <FicheAccesColumnAccessDate
            v-if="user.deactivation_type"
            :text="`Désactivé ${typeDeDesactivation}`"
            :date="user.deactivated_at"
            icon="lock"
            color="text-G700"
            class="mb-2"
        />

        <FicheAccesColumnAccessDate
            v-if="user.anonymized_at"
            text="Anonymisé"
            :date="user.anonymized_at"
            icon="user-secret"
            color="text-G700"
            class="mb-2"
        />
    </div>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";
import { useUserStore } from "@/stores/user.store";
import isUserAccessExpired from "@/utils/isUserAccessExpired";
import FicheAccesColumnAccessDate from "./FicheAccesColumnAccessDate.vue";

const props = defineProps({
    user: Object,
});
const { user } = toRefs(props);
const userStore = useUserStore();

const oldUserAccesses = computed(() => {
    return [...user.value.user_accesses]
        .map((userAccess, index) => ({
            ...userAccess,
            isExpired: hasExpired(index),
        }))
        .reverse()
        .slice(0, -1);
});

function hasExpired(userAccessIndex) {
    // last user access to date
    if (userAccessIndex === 0) {
        return isUserAccessExpired(user.value);
    }

    // on affiche les expirations des anciens accès
    const expiredAt = user.value.user_accesses[userAccessIndex].expires_at;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return expiredAt < today.getTime();
}

const deactivationLabels = {
    admin: "manuellement",
    auto: "automatiquement",
    expired: "après expiration",
};

const typeDeDesactivation = computed(() => {
    return deactivationLabels[user.value.deactivation_type] ?? "";
});
</script>
