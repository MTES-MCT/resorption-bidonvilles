<template>
    <LayoutLoading v-if="data === null || currentRole === null" />
    <Layout v-else>
        <ContentWrapper>
            <h3 class="font-bold text-lg">Permissions par rôle</h3>
            <select v-model="currentRole">
                <option
                    v-for="role in Object.keys(data)"
                    :key="role"
                    :value="role"
                >
                    {{ role }}
                </option>
            </select>

            <table class="zebra">
                <thead>
                    <tr class="bg-primary text-white">
                        <th>Entité</th>
                        <th>Feature</th>
                        <th>Autorisé ?</th>
                        <th>National ou local ?</th>
                    </tr>
                </thead>

                <tbody>
                    <tr
                        v-for="permission in data[currentRole]"
                        :key="`${permission.entity}.${permission.feature}`"
                    >
                        <td>{{ permission.entity }}</td>
                        <td>{{ permission.feature }}</td>
                        <td :class="!permission.allowed ? 'bg-red200' : ''">
                            <Icon
                                :icon="permission.allowed ? 'check' : 'times'"
                            />
                        </td>
                        <td
                            :class="
                                permission.allowed_on_national
                                    ? 'bg-green200'
                                    : ''
                            "
                        >
                            {{
                                permission.allowed_on_national
                                    ? "national"
                                    : "local"
                            }}
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
import { onMounted, ref } from "vue";
import { list } from "@/api/role_permissions.api";

import { ContentWrapper, Icon } from "@resorptionbidonvilles/ui";
import Layout from "@/components/Layout/Layout.vue";
import LayoutLoading from "@/components/LayoutLoading/LayoutLoading.vue";

const data = ref(null);
const currentRole = ref(null);

onMounted(async () => {
    data.value = await list();
    currentRole.value = Object.keys(data.value)[0];
});
</script>
