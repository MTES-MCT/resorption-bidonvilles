<template>
    <div>
        <header class="sidepanel-header">
            <h1 class="sidepanel-title"><font-awesome-icon icon="comment"></font-awesome-icon> &nbsp;Commentaires</h1>
        </header>

        <div class="sidepanel-content">
            <div class="sidepanel-section">
                <div class="comment-form" v-if="hasPermission('shantytown_comment.create', town)">
                    <h1>Ajouter un commentaire</h1>
                    <p>Merci de respecter les règles de confidentialité. Ne pas citer l’identité des individus (Nom, âge, sexe, origine...)</p>

                    <p class="error" v-if="commentErrors.description">
                    <ul>
                        <li v-for="error in commentErrors.description">{{ error }}</li>
                    </ul>

                    <div class="input__group">
                        <textarea v-model="newComment"></textarea>
                    </div>
                    <p><button class="button large" @click="addComment">Ajouter le commentaire</button></p>
                </div>
            </div>

            <div class="sidepanel-section" v-if="town.comments.regular.length === 0">
                <p>Aucun commentaire enregistré pour le moment</p>
            </div>

            <div class="sidepanel-section" v-for="comment in town.comments.regular">
                <article class="userpost userpost--comment">
                    <header class="userpost-header">
                        <p class="userpost-date"><time>{{ formatDate(comment.createdAt, 'd M y à h:i') }}</time></p>
                        <h1 class="userpost-title">
                            <router-link :to="`/annuaire/${comment.createdBy.organizationId}`">
                                <font-awesome-icon icon="user"></font-awesome-icon>
                                <span>{{ comment.createdBy.lastName.toUpperCase() }} {{ comment.createdBy.firstName }}</span>
                            </router-link>
                            <span class="userpost-actions">
                                                <font-awesome-icon icon="pencil-alt" class="userpost-action--edit" v-if="canEditComment(comment)" @click="editComment(comment)"></font-awesome-icon>
                                                <font-awesome-icon icon="trash-alt" class="userpost-action--delete" v-if="canDeleteComment(comment)" @click="deleteComment(comment)"></font-awesome-icon>
                                            </span>
                        </h1>
                    </header>

                    <div v-if="commentEdit.commentId === comment.id">
                        <p class="error" v-if="commentEdit.error">
                        <ul>
                            <li>{{ commentEdit.error }}</li>
                        </ul>
                        <textarea v-model="commentEdit.value" :disabled="commentEdit.pending"></textarea>
                        <p>
                            <button class="button" @click="sendEditComment(comment)">Modifier</button>
                            <button class="button warning" @click="cancelEditComment">Annuler</button>
                        </p>
                    </div>
                    <p v-else>{{ comment.description }}</p>
                </article>
            </div>
        </div>
    </div>
</template>

<script>
    import {hasPermission} from "#helpers/api/config";

    export default {
        props: {
            commentEdit: {
                required: true
            },
            sendEditComment: { required: true},
            cancelEditComment: { required: true},
            town: { required: true},
            commentErrors: { required: true},
            addComment: { required: true},
            newComment: { required: true},
        },
        methods: {
            hasPermission: permissionName => hasPermission(permissionName),
        }
    }
</script>

<style lang="scss" scoped>
    .userpost--comment {
        margin: 10px 0 0;
        padding: 0;
    }

    .comment-form {
        h1 {
            font-size: 1rem;
        }

        p {
            margin: 0;
        }

        textarea {
            margin-top: 15px;
            min-height: 100px;
        }

        .button {
            margin: 0;
            display: inline-block;
            width: 100%;
        }
    }
</style>
