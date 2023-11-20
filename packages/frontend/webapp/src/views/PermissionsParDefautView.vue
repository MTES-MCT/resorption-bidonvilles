<template>
    <LayoutLoading v-if="data === null" />
    <Layout v-else>
        <ContentWrapper>
            <h3 class="font-bold text-lg">Permissions par rôle</h3>

            <table>
                <thead>
                    <tr>
                        <th>Entité</th>
                        <th>Feature</th>
                        <th>Autorisé ?</th>
                        <th>National ou local ?</th>
                    </tr>
                </thead>

                <tbody>
                    <template v-for="role in Object.keys(data)" :key="role">
                        <tr>
                            <th colspan="4" class="text-left">
                                {{ role }}
                            </th>
                        </tr>
                        <tr
                            v-for="permission in data[role]"
                            :key="`${permission.entity}.${permission.feature}`"
                        >
                            <td>{{ permission.entity }}</td>
                            <td>{{ permission.feature }}</td>
                            <td>{{ permission.allowed ? "oui" : "non" }}</td>
                            <td>
                                {{
                                    permission.allow_all ? "national" : "local"
                                }}
                            </td>
                        </tr>
                    </template>
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
import { onMounted, ref } from "vue";
import { listByRoles } from "@/api/permissions.api";

import { ContentWrapper } from "@resorptionbidonvilles/ui";
import Layout from "@/components/Layout/Layout.vue";
import LayoutLoading from "@/components/LayoutLoading/LayoutLoading.vue";

const data = ref(null);

onMounted(async () => {
    data.value = await listByRoles();
});
</script>
