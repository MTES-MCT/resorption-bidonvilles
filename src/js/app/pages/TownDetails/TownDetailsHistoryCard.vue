<template>
    <div>
        <div class="text-md font-bold my-4" :class="color">
            {{ title }}
        </div>
        <div class="pb-4 border-b-2 border-G200">
            <div class="text-sm text-G600">
                {{ formatDate(when, "d M y à h:i") }}
            </div>
            <div class="text-primary">
                <router-link :to="`/annuaire/${author.id} `">
                    <div class="flex items-center">
                        <font-awesome-icon
                            icon="user"
                            class="w-8 text-md"
                        ></font-awesome-icon>
                        <div class="font-bold ml-2">
                            {{ author.first_name }}
                            {{ author.last_name }}
                        </div>
                    </div>
                </router-link>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "TownDetailsHistoryCard",
    props: {
        author: {
            type: Object
        },
        title: {
            type: String
        },
        color: {
            type: String
        },
        when: {
            type: undefined
        }
    },
    methods: {
        /**
         * @see index.js
         */
        formatDate(...args) {
            return window.App.formatDate.apply(window, args);
        }
    },
    data() {
        return {};
    }
};
</script>
