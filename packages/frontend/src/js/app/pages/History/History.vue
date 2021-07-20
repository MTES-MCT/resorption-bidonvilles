<template>
    <PrivateLayout v-if="loading">
        <div class="text-center text-primary text-display-lg mt-16">
            <Spinner />
        </div>
    </PrivateLayout>

    <PrivateLayout v-else>
        <PrivateContainer class="pt-16 pb-4">
            <ActivityCard
                v-for="(activity, index) in content"
                v-bind:key="index"
                :activity="activity"
                class="border-t py-4"
            ></ActivityCard>
            <div class="flex flex-col items-end mb-12 mt-2">
                <Pagination
                    class="md:mt-0 mb-2"
                    v-if="numberOfPages > 1"
                    :currentPage="currentPageIndex + 1"
                    :nbPages="numberOfPages"
                    :onChangePage="onPageChange"
                />
                <div class="pr-6 text-G600">{{ elementsOnPage }}</div>
            </div>
        </PrivateContainer>
    </PrivateLayout>
</template>

<script>
import PrivateContainer from "#app/components/PrivateLayout/PrivateContainer.vue";
import PrivateLayout from "#app/components/PrivateLayout";
import ActivityCard from "#app/components/ActivityCard/ActivityCard";
import { listRegular } from "#helpers/api/userActivity";

const ACTIVITIES_PER_PAGE = 10;

export default {
    components: {
        PrivateLayout,
        PrivateContainer,
        ActivityCard
    },
    data() {
        return {
            currentPageIndex: 0,
            activities: [],
            error: null,
            loading: false
        };
    },
    computed: {
        content() {
            return this.activities.slice(
                this.currentPageIndex * ACTIVITIES_PER_PAGE,
                (this.currentPageIndex + 1) * ACTIVITIES_PER_PAGE
            );
        },
        numberOfPages() {
            return Math.ceil(this.activities.length / ACTIVITIES_PER_PAGE);
        },
        elementsOnPage() {
            const start = Math.min(
                this.currentPageIndex * ACTIVITIES_PER_PAGE + 1,
                this.activities.length
            );
            const end = Math.min(
                (this.currentPageIndex + 1) * ACTIVITIES_PER_PAGE,
                this.activities.length
            );

            return `${start} - ${end} sur ${this.activities.length}`;
        }
    },
    mounted() {
        this.load();
    },
    methods: {
        async load() {
            if (this.loading === true) {
                return;
            }

            this.activities = [];
            this.currentPageIndex = 0;
            this.error = null;
            this.loading = true;

            try {
                this.activities = await listRegular();
            } catch (error) {
                this.error =
                    (error && error.user_message) ||
                    "Une erreur inconnue est survenue";
            }

            this.loading = false;
        },

        onPageChange(page) {
            this.currentPageIndex = page - 1;
        }
    }
};
</script>
