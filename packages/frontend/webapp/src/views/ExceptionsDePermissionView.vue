<template>
    <LayoutLoading v-if="data === null" />
    <Layout v-else>
        <ContentWrapper>
            <Filter
                title="Statut"
                :options="[
                    { label: 'Actif', value: 'active' },
                    { label: 'Inactif', value: 'inactive' },
                ]"
                v-model="statusFilter"
            />
            <Filter
                title="Feature"
                :options="featureFilterOptions"
                v-model="featureFilter"
            />
            <Filter
                title="Type d'extension"
                :options="[
                    { label: 'Région', value: 'regions' },
                    { label: 'Département', value: 'departements' },
                    { label: 'EPCI', value: 'epci' },
                    { label: 'Commune', value: 'cities' },
                    { label: 'Action', value: 'actions' },
                ]"
                v-model="attachmentFilter"
            />
            <Filter
                title="Extension ou interdiction"
                :options="[
                    { label: 'Extension', value: 'true' },
                    { label: 'Interdiction', value: 'false' },
                ]"
                v-model="typeFilter"
            />
        </ContentWrapper>

        <ContentWrapper>
            <h3 class="font-bold text-lg">
                Utilisateurs avec exceptions de permission
            </h3>
            <table class="w-full zebra">
                <thead class="bg-primary text-white">
                    <th>#</th>
                    <th>Nom</th>
                    <th>Statut du compte</th>
                    <th>Permissions exceptionnelles</th>
                </thead>
                <tbody>
                    <tr
                        v-for="id in Object.keys(parsedData.users)"
                        :key="id"
                        :class="{
                            'bg-red200':
                                parsedData.users[id].status === 'inactive',
                            'bg-blue200': parsedData.users[id].status === 'new',
                        }"
                    >
                        <td class="text-center">
                            <Link :to="`/acces/${id}`"
                                >{{ parsedData.users[id].user_id }}
                            </Link>
                        </td>
                        <td>
                            <Link :to="`/acces/${id}`"
                                >{{ parsedData.users[id].first_name }}
                                {{
                                    parsedData.users[id].last_name.toUpperCase()
                                }}</Link
                            >
                        </td>
                        <td>{{ parsedData.users[id].status }}</td>
                        <td>
                            <ul class="ml-3">
                                <li
                                    v-for="(exception, idx) in parsedData.users[
                                        id
                                    ].exceptions"
                                    :key="idx"
                                >
                                    <span
                                        class="font-bold"
                                        :class="[
                                            exception.allowed
                                                ? 'text-green'
                                                : 'text-red',
                                        ]"
                                        ><Icon
                                            :icon="
                                                exception.allowed
                                                    ? 'plus'
                                                    : 'minus'
                                            "
                                        />
                                        {{ exception.entity }}.{{
                                            exception.feature
                                        }}</span
                                    ><br />
                                    <span
                                        class="pl-4"
                                        v-if="exception.regions?.length"
                                    >
                                        Régions : {{ exception.regions }}
                                    </span>
                                    <span
                                        class="pl-4"
                                        v-if="exception.departements?.length"
                                    >
                                        Départements :
                                        {{ exception.departements }}
                                    </span>
                                    <span
                                        class="pl-4"
                                        v-if="exception.epci?.length"
                                    >
                                        EPCI : {{ exception.epci }}
                                    </span>
                                    <span
                                        class="pl-4"
                                        v-if="exception.cities?.length"
                                    >
                                        Villes : {{ exception.cities }}
                                    </span>
                                    <span
                                        class="pl-4"
                                        v-if="exception.actions?.length"
                                    >
                                        Actions : {{ exception.actions }}
                                    </span>
                                </li>
                            </ul>
                        </td>
                    </tr>
                </tbody>
            </table>
        </ContentWrapper>

        <ContentWrapper class="mt-6">
            <h3 class="font-bold text-lg">
                Structures avec exceptions de permission
            </h3>
            <table class="w-full zebra">
                <thead class="bg-primary text-white">
                    <th>#</th>
                    <th>Nom</th>
                    <th>Nombre de comptes actifs</th>
                    <th>Permissions exceptionnelles</th>
                </thead>
                <tbody>
                    <tr
                        v-for="id in Object.keys(parsedData.organizations)"
                        :key="id"
                        :class="{
                            'bg-red200':
                                parsedData.organizations[id]
                                    .nb_of_active_users === 0,
                        }"
                    >
                        <td class="text-center">
                            <Link :to="`/structure/${id}`"
                                >{{
                                    parsedData.organizations[id].organization_id
                                }}
                            </Link>
                        </td>
                        <td>
                            <Link :to="`/structure/${id}`">{{
                                parsedData.organizations[id].abbreviation ||
                                parsedData.organizations[id].name
                            }}</Link>
                        </td>
                        <td>
                            {{
                                parsedData.organizations[id].nb_of_active_users
                            }}
                        </td>
                        <td>
                            <ul class="ml-3">
                                <li
                                    v-for="(exception, idx) in parsedData
                                        .organizations[id].exceptions"
                                    :key="idx"
                                >
                                    <span
                                        class="font-bold"
                                        :class="[
                                            exception.allowed
                                                ? 'text-green'
                                                : 'text-red',
                                        ]"
                                        ><Icon
                                            :icon="
                                                exception.allowed
                                                    ? 'plus'
                                                    : 'minus'
                                            "
                                        />
                                        {{ exception.entity }}.{{
                                            exception.feature
                                        }}</span
                                    ><br />
                                    <span
                                        class="pl-4"
                                        v-if="exception.regions?.length"
                                    >
                                        Régions : {{ exception.regions }}
                                    </span>
                                    <span
                                        class="pl-4"
                                        v-if="exception.departements?.length"
                                    >
                                        Départements :
                                        {{ exception.departements }}
                                    </span>
                                    <span
                                        class="pl-4"
                                        v-if="exception.epci?.length"
                                    >
                                        EPCI : {{ exception.epci }}
                                    </span>
                                    <span
                                        class="pl-4"
                                        v-if="exception.cities?.length"
                                    >
                                        Villes : {{ exception.cities }}
                                    </span>
                                    <span
                                        class="pl-4"
                                        v-if="exception.actions?.length"
                                    >
                                        Actions : {{ exception.actions }}
                                    </span>
                                </li>
                            </ul>
                        </td>
                    </tr>
                </tbody>
            </table>
        </ContentWrapper>
    </Layout>
</template>

<style lang="scss" scoped>
.zebra,
.zebra th,
.zebra td {
    @apply border border-G400 px-1 py-2;
}
</style>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { listWithPermissions } from "@/api/users.api";

import { ContentWrapper, Filter, Icon, Link } from "@resorptionbidonvilles/ui";
import Layout from "@/components/Layout/Layout.vue";
import LayoutLoading from "@/components/LayoutLoading/LayoutLoading.vue";

const data = ref(null);
const statusFilter = ref(["active"]);
const featureFilter = ref([]);
const attachmentFilter = ref(["regions", "departements", "epci", "cities"]);
const typeFilter = ref(["true", "false"]);

const featureFilterOptions = computed(() => {
    if (!data.value) {
        return [];
    }

    const options = data.value.users.reduce(
        (acc, { fk_feature, fk_entity }) => {
            if (!acc.includes(`${fk_entity}.${fk_feature}`)) {
                acc.push(`${fk_entity}.${fk_feature}`);
            }

            return acc;
        },
        []
    );

    data.value.organizations.reduce((acc, { fk_feature, fk_entity }) => {
        if (!acc.includes(`${fk_entity}.${fk_feature}`)) {
            acc.push(`${fk_entity}.${fk_feature}`);
        }

        return acc;
    }, options);

    return options
        .map((label) => ({
            label,
            value: label,
        }))
        .sort((a, b) => {
            return a.label.localeCompare(b.label);
        });
});
watch(featureFilterOptions, () => {
    featureFilter.value.splice(0, featureFilter.value.length);
    featureFilterOptions.value.forEach((option) => {
        featureFilter.value.push(option.value);
    });
});

onMounted(async () => {
    data.value = await listWithPermissions();
});

function applyStatusFilterToUser(row) {
    if (statusFilter.value.length === 0) {
        return false;
    }

    return statusFilter.value.includes(
        row.fk_status === "active" ? "active" : "inactive"
    );
}

function applyStatusFilterToOrganization(row) {
    if (statusFilter.value.length === 0) {
        return false;
    }

    return statusFilter.value.includes(row.count > 0 ? "active" : "inactive");
}

function applyFeatureFilter(row) {
    if (featureFilter.value.length === 0) {
        return false;
    }

    return featureFilter.value.includes(`${row.fk_entity}.${row.fk_feature}`);
}

function applyAttachmentFilter(row) {
    if (attachmentFilter.value.length === 0) {
        return false;
    }

    return attachmentFilter.value.includes(
        ["regions", "departements", "epci", "cities", "actions"].find((key) => {
            return row[key]?.length > 0;
        })
    );
}

function applyTypeFilter(row) {
    if (typeFilter.value.length === 0) {
        return false;
    }

    return typeFilter.value.includes(row.allowed === true ? "true" : "false");
}

const parsedData = computed(() => {
    if (!data.value) {
        return {
            users: {},
            organizations: {},
        };
    }

    return {
        users: data.value.users.reduce((acc, row) => {
            if (
                !applyStatusFilterToUser(row) ||
                !applyFeatureFilter(row) ||
                !applyAttachmentFilter(row) ||
                !applyTypeFilter(row)
            ) {
                return acc;
            }

            if (!acc[row.user_id]) {
                acc[row.user_id] = {
                    user_id: row.user_id,
                    first_name: row.first_name,
                    last_name: row.last_name,
                    email: row.email,
                    organization: row.fk_organization,
                    status: row.fk_status,
                    exceptions: [],
                };
            }

            acc[row.user_id].exceptions.push({
                id: row.user_permission_id,
                feature: row.fk_feature,
                entity: row.fk_entity,
                allowed: row.allowed,
                regions: row.regions,
                departements: row.departements,
                epci: row.epci,
                cities: row.cities,
                actions: row.actions,
            });
            return acc;
        }, {}),
        organizations: data.value.organizations.reduce((acc, row) => {
            if (
                !applyStatusFilterToOrganization(row) ||
                !applyFeatureFilter(row) ||
                !applyAttachmentFilter(row) ||
                !applyTypeFilter(row)
            ) {
                return acc;
            }

            if (!acc[row.organization_id]) {
                acc[row.organization_id] = {
                    organization_id: row.organization_id,
                    name: row.name,
                    abbreviation: row.abbreviation,
                    nb_of_active_users: row.count || 0,
                    exceptions: [],
                };
            }

            acc[row.organization_id].exceptions.push({
                id: row.user_permission_id,
                feature: row.fk_feature,
                entity: row.fk_entity,
                allowed: row.allowed,
                regions: row.regions,
                departements: row.departements,
                epci: row.epci,
                cities: row.cities,
                actions: row.actions,
            });
            return acc;
        }, {}),
    };
});
</script>
