<template>
    <PrivateLayout>
        <PrivateContainer>
            <div v-if="users.length">
                <UserListHeader
                    :filters="filters"
                    @update:search="val => (filters.search = val)"
                    @update:status="val => (filters.status = val)"
                />
                <UserListTable :users="filteredUsersByPage" />
                <div class="flex justify-end mt-8">
                    <Pagination
                        class="md:mt-0 mb-2"
                        v-if="nbPages > 1"
                        :currentPage="currentPage"
                        :nbPages="nbPages"
                        :onChangePage="onChangePage"
                    />
                    <div class="pr-6 text-G600">{{ elementsOnPage }}</div>
                </div>
            </div>
            <div v-else class="text-center text-primary text-display-lg mt-16">
                <Spinner />
            </div>
        </PrivateContainer>
    </PrivateLayout>
</template>

<script>
import PrivateLayout from "#app/components/PrivateLayout";
import UserListHeader from "./UserListHeader/index.vue";
import UserListTable from "./UserListTable";
import { list } from "#helpers/api/user";
import PrivateContainer from "#app/components/PrivateLayout/PrivateContainer";
import enrichUsersWithStatus from "./enrichUsersWithStatus";
import Fuse from "fuse.js";

const PER_PAGE = 100;

let fuse;

export default {
    components: {
        PrivateContainer,
        UserListHeader,
        UserListTable,
        PrivateLayout
    },
    computed: {
        filteredUsers() {
            if (this.filters.search) {
                const searchUsers = fuse.search(this.filters.search);

                return searchUsers.reduce((acc, searchItem) => {
                    const user = searchItem.item;

                    if (this.filterStatus(user)) {
                        return [...acc, user];
                    }

                    return acc;
                }, []);
            }

            return this.users.filter(this.filterStatus);
        },
        filteredUsersByPage() {
            return this.filteredUsers.slice(
                (this.currentPage - 1) * PER_PAGE,
                PER_PAGE * this.currentPage
            );
        },
        nbPages() {
            return Math.ceil(this.filteredUsers.length / PER_PAGE);
        },
        elementsOnPage() {
            const start = (this.currentPage - 1) * PER_PAGE + 1;
            const end =
                this.currentPage < this.nbPages
                    ? start + PER_PAGE - 1
                    : start + (this.filteredUsers.length % PER_PAGE) - 1;

            return `${start} - ${end} sur ${this.filteredUsers.length}`;
        }
    },
    methods: {
        filterStatus(user) {
            return (
                !this.filters.status.length ||
                this.filters.status.includes(user.user_status.type)
            );
        },
        onChangePage(newPage) {
            this.currentPage = newPage;
        },
        load() {
            list()
                .then(users => {
                    this.users = enrichUsersWithStatus(users).filter(
                        ({ status }) => status !== "inactive"
                    );
                    const options = {
                        threshold: 0.0,
                        ignoreLocation: true,
                        useExtendedSearch: true,
                        shouldSort: false,
                        isCaseSensitive: false,
                        keys: [
                            "full_name",
                            "organization.name",
                            "organization.abbreviation",
                            "position",
                            "territory",
                            "role"
                        ]
                    };

                    fuse = new Fuse(this.users, options);
                })
                .catch(({ user_message: error }) => {
                    this.error = error;
                });
        }
    },
    data() {
        return {
            filters: {
                search: "",
                status: []
            },
            error: null,
            users: [],
            currentPage: 1
        };
    },
    created() {
        this.load();
    }
};
</script>
