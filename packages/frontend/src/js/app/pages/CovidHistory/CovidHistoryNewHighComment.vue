<template>
    <div>
        <div class="text-display-lg text-corail">
            <Icon icon="comment" /> Écrire un message 'Territoire'
        </div>
        <div class="text-display-sm py-4">
            Les messages "territoires" permettent de partager des informations
            sur le pilotage, la coordination et l'organisation retenus au niveau
            local.
        </div>
        <div v-if="allowedDepartements.length >= 1">
            <div v-if="allowedDepartements.length > 1">
                <CheckableGroup
                    label="Territoire(s) concerné(s) par votre message"
                >
                    <Checkbox
                        v-for="departement in allowedDepartements"
                        v-model="departements"
                        :key="departement.code"
                        :checkValue="departement.code"
                        :label="departement.name"
                    />
                </CheckableGroup>
            </div>
            <div v-else-if="allowedDepartements.length === 1">
                <span class="font-bold"
                    >Territoire concerné par votre message :</span
                >
                {{ allowedDepartements[0].name }}
            </div>
            <div class="bg-white p-6 customShadow mt-4">
                <div><Icon icon="user" /> {{ user.first_name }}</div>
                <p v-if="this.error !== null" class="mt-2 font-bold text-red">
                    {{ this.error }}
                </p>
                <TextArea
                    class="block mt-2"
                    rows="5"
                    name="newComment"
                    v-model="newComment"
                    placeholder="Saisissez ici votre message"
                />
                <div class="flex items-center justify-between">
                    <Button
                        variant="primary"
                        @click="addComment"
                        :loading="this.loading"
                        >Valider</Button
                    >
                    <Button
                        v-if="newComment !== ''"
                        variant="tertiaryText"
                        @click="cancelComment"
                        >Annuler</Button
                    >
                </div>
            </div>
        </div>
        <div v-else>
            Vous n'avez pas le droit de publier des messages "territoires".
        </div>
    </div>
</template>

<script>
import { create } from "#helpers/api/highCovidComment";
import CheckableGroup from "#app/components/ui/Form/CheckableGroup";
import { mapGetters } from "vuex";
import { get as getConfig } from "#helpers/api/config";

export default {
    components: { CheckableGroup },
    data() {
        const { user } = getConfig();

        return {
            error: null,
            loading: false,
            newComment: "",
            departements: [],
            user
        };
    },
    mounted() {
        this.$store.dispatch("fetchAllowedDepartements");
    },
    computed: {
        ...mapGetters({
            allowedDepartements: "allowedDepartements"
        }),
        inputDepartements() {
            if (this.allowedDepartements.length === 1) {
                return [this.allowedDepartements[0].code];
            }

            return this.departements;
        }
    },
    methods: {
        cancelComment() {
            this.newComment = "";
        },
        async addComment() {
            if (this.loading === true) {
                return;
            }

            this.loading = true;
            this.error = null;

            try {
                await create({
                    departements: this.inputDepartements,
                    description: this.newComment
                });
                this.newComment = "";
            } catch (error) {
                this.error =
                    (error && error.user_message) || "Une erreur est survenue";
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
