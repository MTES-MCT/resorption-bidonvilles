<template>
    <PrivateLayout class="mb-16">
        <AccountRead v-if="!edit" :user="user" @openEdit="edit = true" />
        <AccountEdit v-else :user="user" @cancelEdit="edit = false" />
    </PrivateLayout>
</template>

<script>
import PrivateLayout from "#app/components/PrivateLayout";
import AccountRead from "./AccountRead/AccountRead";
import AccountEdit from "./AccountEdit/AccountEdit";
import { get as getConfig } from "#helpers/api/config";

export default {
    components: {
        PrivateLayout,
        AccountRead,
        AccountEdit
    },
    data() {
        const { user } = getConfig();

        return {
            user,
            edit: false
        };
    }
};
</script>
