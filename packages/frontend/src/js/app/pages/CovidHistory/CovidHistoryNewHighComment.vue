<template>
    <div>
        <div class="text-display-lg text-corail">
            <Icon icon="comment" /> Ecrire un commentaire 'Territoire'
        </div>
        <div class="text-display-md pt-6 pb-4">
            Les commentaires "territoires" permettent de partager des
            informations sur le pilotage, la coordination et l'organisation
            retenus au niveau local.
        </div>
        <div v-if="allowedDepartements.length > 1">
            <CheckableGroup
                label="Territoire(s) concerné(s) par votre commentaire"
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
            Territoire concerné par votre commentaire :
            {{ allowedDepartements[0].name }}
        </div>
        <div class="bg-white p-6 customShadow">
            <div class="mb-4"><Icon icon="user" /> {{ user.first_name }}</div>
            <TextArea rows="5" name="newComment" v-model="newComment" />
            <div class="flex items-center justify-between">
                <Button variant="primaryText" @click="cancelComment"
                    >Annuler</Button
                >
                <Button
                    variant="tertiary"
                    @click="addComment"
                    :loading="this.highCovidComment.pending"
                    >Valider</Button
                >
            </div>
            <p v-if="highCovidComment.error !== null">
                <span style="color:red">
                    {{ highCovidComment.error.message }}
                </span>
            </p>
        </div>
    </div>
</template>

<script>
import CheckableGroup from "#app/components/ui/Form/CheckableGroup";

export default {
    components: { CheckableGroup },
    data() {
        return {
            commentError: null,
            commentErrors: {},
            loading: false,
            newComment: "",
            departements: this.allowedDepartements.map(departement => {
                return departement.code;
            })
        };
    },
    props: {
        nbComments: {
            type: Number
        },
        user: {
            type: Object
        },
        allowedDepartements: {
            type: Array
        },
        highCovidComment: {
            type: Object
        }
    },
    methods: {
        cancelComment() {
            this.newComment = "";
        },
        async addComment() {
            this.$emit("addComment", {
                description: this.newComment,
                departements: this.departements
            });
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
