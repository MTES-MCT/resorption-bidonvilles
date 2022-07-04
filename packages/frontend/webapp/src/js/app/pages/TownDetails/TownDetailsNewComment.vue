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
                class="flex flex-col ml-4"
                v-if="
                    $store.getters['config/hasPermission'](
                        'shantytown_comment.createPrivate'
                    )
                "
            >
                <div class="flex ml-4">
                    <div class="text-sm mr-4">
                        <Icon icon="lock" class="text-red" />
                        Je souhaite réserver ce message à mes collègues en
                        Préfecture et DDETS
                    </div>
                    <CheckableGroup
                        direction="horizontal"
                        id="private_comments"
                    >
                        <Radio
                            label="Oui"
                            v-model="isPrivate"
                            :checkValue="true"
                            cypressName="private_comments"
                        ></Radio>
                        <Radio
                            label="Non"
                            v-model="isPrivate"
                            :checkValue="false"
                            cypressName="private_comments"
                        ></Radio>
                    </CheckableGroup>
                </div>
                <div class="flex ml-4">
                    <div class="text-sm mr-4">
                        <Icon icon="lock" class="text-red" />
                        Je souhaite réserver ce message à certaines structures
                        ou certains utilisateurs (*)
                    </div>
                    <CheckableGroup
                        direction="horizontal"
                        id="private_comments_choose_target"
                    >
                        <Radio
                            label="Oui"
                            v-model="isPrivateChooseTarget"
                            :checkValue="true"
                        ></Radio>
                        <Radio
                            label="Non"
                            v-model="isPrivateChooseTarget"
                            :checkValue="false"
                        ></Radio>
                    </CheckableGroup>
                </div>
                <div class="w-8/12" v-if="isPrivateChooseTarget">
                    <AutocompleteV2
                        id="target"
                        :placeholder="'Nom d\'une structure, d\'un utilisateur'"
                        prefixIcon="search"
                        :search="search"
                        :getResultValue="getResultValue"
                        validationName="Cible"
                        @submit="submit"
                        rules=""
                        :disabled="false"
                    ></AutocompleteV2>
                    <span
                        >Liste des utilisateurs autorisés à lire le commentaire
                        :</span
                    >
                    <div class="flex flex-col border my-4">
                        <span class="ml-4"> Structures :</span>
                        <div
                            class="ml-12"
                            v-for="organizationTarget in listOfTargets.organizations"
                            :key="organizationTarget.id"
                        >
                            - {{ organizationTarget.label }}
                        </div>
                        <span class="ml-4">Utilisateurs : </span>
                        <div
                            class="ml-12"
                            v-for="userTarget in listOfTargets.users"
                            :key="userTarget.id"
                        >
                            - {{ userTarget.label }}
                        </div>
                    </div>
                </div>
                <span class="text-sm "
                    >* Les administrateurs locaux et nationaux auront accès au
                    message pour des fins de modération</span
                >
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
import { autocompleteOrganization as autocompleter } from "#helpers/api/user";

export default {
    data() {
        return {
            commentError: null,
            commentErrors: {},
            newComment: "",
            isPrivate: false,
            isPrivateChooseTarget: false,
            loading: false,
            input: "",
            results: [],
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
        },
        async search(input) {
            this.input = input;

            if (input) {
                this.results = await autocompleter(
                    input,
                    this.departementCode,
                    true
                );
                return this.results;
            }
            return [];
        },
        getResultValue(input) {
            return input.label;
        },
        cancelComment() {
            this.newComment = "";
        },
        async addComment() {
            if (this.loading === true) {
                return;
            }

            // clean previous errors
            this.commentError = null;
            this.commentErrors = {};
            this.loading = true;

            try {
                await this.$store.dispatch(
                    "shantytownComments/publishComment",
                    {
                        townId: parseInt(this.$route.params.id, 10),
                        comment: {
                            description: this.newComment,
                            private: this.isPrivate,
                            targets: this.listOfTargets
                        }
                    }
                );

                this.newComment = "";
                this.isPrivate = false;
                this.isPrivateChooseTarget = false;
                this.listOfTargets = {
                    users: [],
                    organizations: []
                };
            } catch (response) {
                this.commentError = response.user_message;
                this.commentErrors = response.fields || {};
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
