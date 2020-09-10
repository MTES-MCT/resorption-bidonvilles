<template>
    <div>
        <header class="sidepanel-header">
            <h1 class="sidepanel-title"><font-awesome-icon icon="history"></font-awesome-icon> &nbsp;Historique des modifications</h1>
        </header>

        <div class="sidepanel-content">
            <div class="sidepanel-section" v-for="changelog in town.changelog">
                <article class="userpost userpost--changelog">
                    <header class="userpost-header">
                        <p class="userpost-date"><time>{{ formatDate(changelog.date, 'd M y à h:i') }}</time></p>
                        <h1 class="userpost-title">
                            <router-link :to="`/annuaire/${changelog.author.organization.id}`">
                                <font-awesome-icon icon="user"></font-awesome-icon>
                                <span>{{ changelog.author.last_name.toUpperCase() }} {{ changelog.author.first_name }}</span>
                            </router-link>
                        </h1>
                    </header>

                    <p v-for="diff in changelog.diff" class="changelog">
                        <span class="changelog-name">{{ diff.field }} :</span><br/>
                        <span class="changelog-oldValue" v-bind:class="{ 'changelog-value--unknown': !diff.oldValue }">{{ diff.oldValue || 'non renseigné' }}</span>,
                        <span class="changelog-newValue" v-bind:class="{ 'changelog-value--unknown': !diff.newValue }">{{ diff.newValue || 'non renseigné' }}</span>
                    </p>
                </article>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            town: {
                required: true,
                type: Object
            }
        },
        methods: {
            formatDate: (...args) => App.formatDate(...args),
        }
    }
</script>

<style lang="scss" scoped>
    @import '/css/config/colors.scss';

    .userpost--changelog {
        .userpost-header {
            margin-bottom: 15px;
        }
    }

    .changelog {
        padding-top: 7px;
        margin: 0 0 7px;
        border-top: 1px dotted $REGENT_GRAY;
    }
</style>
