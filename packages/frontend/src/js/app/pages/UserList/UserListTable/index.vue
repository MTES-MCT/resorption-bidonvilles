<template>
    <div class="shadow-md">
        <div
            class="userListGrid bg-G200 font-bold pt-4 pb-2 px-4 border-b-2 border-black"
        >
            <div>NOM Prénom</div>
            <div>Structure</div>
            <div>Territoire</div>
            <div>Type d'accès</div>
            <div>Statut du compte</div>
        </div>

        <router-link
            v-for="user in users"
            :key="user.id"
            :to="'/nouvel-utilisateur/' + user.id"
        >
            <UserListTableRow class="userListGrid" :user="user" />
        </router-link>
    </div>
</template>

<script>
import UserListTableRow from "#app/pages/UserList/UserListTable/UserListTableRow";
export default {
    components: { UserListTableRow },
    props: {
        users: {
            type: Array
        }
    }
};
</script>

<style scoped>
.userListGrid {
    @apply grid gap-x-8;
    grid-template-columns: 1.5fr 1.5fr 1fr 1fr 1fr;
}
</style>
