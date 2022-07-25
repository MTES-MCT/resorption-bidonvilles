<template>
    <div>
        <div class="text-display-lg font-bold text-corail">
            <Icon icon="comment" /> LE JOURNAL DU SITE
            <span
                >- {{ nbComments }} message{{ nbComments > 1 ? "s" : "" }}</span
            >
        </div>
        <div class="text-display-md font-bold pt-6 pb-4">
            Partager une info
        </div>
        <div class="bg-white p-6 customShadow">
            <div class="mb-4">
                <Icon icon="user" /> {{ user.first_name }} {{ user.last_name }}
            </div>
            <TextArea
                rows="5"
                name="newComment"
                :disabled="loading"
                v-model="newComment"
                placeholder="Partagez votre passage sur le site, le contexte sanitaire, la situation des habitants, difficultés rencontrées lors de votre intervention…"
            />
            <div
                class="flex flex-col"
                v-if="
                    $store.getters['config/hasPermission'](
                        'shantytown_comment.createPrivate'
                    )
                "
            >
                <p class="mt-0 mb-2 font-bold">
                    <Icon icon="lock" class="text-red mr-1" /> Je souhaite que
                    ce message soit visible par <sup>(*)</sup> :
                </p>
                <div class="ml-5">
                    <CheckableGroup direction="vertical">
                        <Radio
                            label="Tous les acteurs du site"
                            v-model="mode"
                            checkValue="public"
                        />
                        <Radio
                            label="Les acteurs en préfecture et DDETS uniquement"
                            v-model="mode"
                            checkValue="pref_et_ddets"
                        />
                        <Radio
                            label="Une liste d'acteurs personnalisée"
                            v-model="mode"
                            checkValue="custom"
                        />
                    </CheckableGroup>
                </div>

                <div v-if="mode === 'custom'" class="ml-12">
                    <p class="font-bold">
                        <Icon icon="users" class="mr-1" />
                        Liste d'acteurs personnalisée
                    </p>
                    <div></div>
                    <p class="mb-2">
                        Saisissez ci-dessous le nom d'une structure ou d'un
                        acteur pour l'ajouter à la liste :
                    </p>
                    <AutocompleteV2
                        id="target"
                        placeholder="Nom d'une structure, d'un utilisateur"
                        prefixIcon="search"
                        :search="search"
                        :getResultValue="getResultValue"
                        validationName="Cible"
                        @submit="submit"
                        rules=""
                        :disabled="false"
                        ref="targetSearch"
                    ></AutocompleteV2>
                    <div
                        class="border rounded p-4 -mt-4 flex flex-wrap gap-2 mb-6"
                    >
                        <p v-if="targets.length === 0" class="text-G600 italic">
                            La liste est vide pour le moment
                        </p>
                        <template v-else>
                            <Tag
                                v-for="target in targets"
                                :key="`${target.type.id}.${target.id}`"
                            >
                                {{ target.label }}
                            </Tag>
                        </template>
                    </div>
                </div>

                <span class="text-sm text-right mb-2"
                    >(*) Quelle que soit l'option retenue, les administrateurs
                    locaux et nationaux auront accès au message à des fins de
                    modération</span
                >
            </div>

            <div
                v-if="commentError !== null"
                class="text-red border border-red py-2 px-4 mb-4"
            >
                {{ commentError }}
                <ul v-if="commentErrors.length" class="text-sm">
                    <li v-for="(error, index) in commentErrors" :key="index">
                        - {{ error }}
                    </li>
                </ul>
            </div>

            <div class="flex items-center justify-between">
                <p>
                    <Button
                        variant="primaryText"
                        @click="cancelComment"
                        v-if="newComment"
                        >Annuler</Button
                    >
                </p>
                <Button
                    variant="tertiary"
                    @click="addComment"
                    :loading="loading"
                    >Valider</Button
                >
            </div>
        </div>
    </div>
</template>

<script>
import { autocompleteOrganization } from "#helpers/api/user";

export default {
    data() {
        return {
            commentError: null,
            commentErrors: [],
            newComment: "",
            mode: "public",
            loading: false,
            listOfTargets: {
                users: [],
                organizations: []
            }
        };
    },
    props: {
        nbComments: {
            type: Number
        },
        user: {
            type: Object
        },
        departementCode: {
            type: String
        }
    },
    computed: {
        targets() {
            return [
                ...this.listOfTargets.organizations,
                ...this.listOfTargets.users
            ];
        }
    },
    methods: {
        submit(result) {
            if (
                result &&
                result.type.id === "user" &&
                !this.listOfTargets.users.find(user => user.id === result.id)
            ) {
                this.listOfTargets.users.push(result);
            }
            if (
                result &&
                result.type.id === "organization" &&
                !this.listOfTargets.organizations.find(
                    organization => organization.id === result.id
                )
            ) {
                this.listOfTargets.organizations.push(result);
            }

            this.$refs.targetSearch.empty();
            this.$nextTick(() => this.$refs.targetSearch.focus());
        },
        async search(input) {
            if (input) {
                return await autocompleteOrganization(
                    input,
                    this.departementCode,
                    true
                );
            }

            return [];
        },
        getResultValue(item) {
            return item.label;
        },
        cancelComment() {
            this.newComment = "";
            this.commentError = null;
            this.commentErrors = [];
        },
        async addComment() {
            if (this.loading === true) {
                return;
            }

            // clean previous errors
            this.commentError = null;
            this.commentErrors = [];
            this.loading = true;

            try {
                await this.$store.dispatch(
                    "shantytownComments/publishComment",
                    {
                        townId: parseInt(this.$route.params.id, 10),
                        comment: {
                            description: this.newComment,
                            targets: {
                                mode: this.mode,
                                ...this.listOfTargets
                            }
                        }
                    }
                );

                this.newComment = "";
                this.listOfTargets = {
                    users: [],
                    organizations: []
                };
            } catch (response) {
                this.commentError = response.user_message;
                this.commentErrors = response.fields
                    ? Object.values(response.fields).flat()
                    : [];
            }

            this.loading = false;
        }
    }
};
</script>

<style scoped>
.customShadow {
    box-shadow: 0 0px 20px 0 rgba(255, 194, 158, 0.3),
        0 0px 0px 0 rgba(0, 0, 0, 0.06);
}
</style>
