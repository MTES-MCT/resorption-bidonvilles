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
                    </p>

                    <div class="input__group">
                        <textarea v-model="newComment"></textarea>
                    </div>
                    <p><button class="button large" @click="createComment">Ajouter le commentaire</button></p>
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
                        </p>
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
    import {get as getConfig, hasPermission} from "#helpers/api/config";
    import {addComment, editComment} from "#helpers/api/town";
    import {notify} from "#helpers/notificationHelper";

    export default {
        props: {
            town: { required: true},
            deleteComment: { required: true, type: Function},
        },
        data() {
            return {
                newComment: '',
                commentError: null,
                commentErrors: {},
                commentEdit: {
                    commentId: null,
                    value: null,
                    pending: false,
                    error: null,
                },
                userId: getConfig().user.id,
            }
        },
        methods: {
            hasPermission: permissionName => hasPermission(permissionName),
            formatDate: (...args) => App.formatDate(...args),
            createComment() {
                if (!hasPermission('shantytown_comment.create')) {
                    return;
                }

                // clean previous errors
                this.commentError = null;
                this.commentErrors = {};

                addComment(this.$route.params.id, {
                    description: this.newComment,
                })
                    .then((response) => {
                        this.town.comments.regular = response.comments;
                        this.newComment = '';
                        this.newStep = '';
                    })
                    .catch((response) => {
                        this.commentError = response.user_message;
                        this.commentErrors = response.fields || {};
                    });
            },
            sendEditComment(comment) {
                if (this.commentEdit.pending !== false) {
                    return;
                }

                this.commentEdit.pending = true;
                this.commentEdit.error = null;

                editComment(this.$route.params.id, comment.id, { description: this.commentEdit.value })
                    .then((response) => {
                        this.town.comments.regular = response.comments;
                        this.commentEdit.commentId = null;
                        this.commentEdit.value = null;
                        this.commentEdit.pending = false;
                        this.commentEdit.error = null;

                        notify({
                            group: 'notifications',
                            type: 'success',
                            title: 'Opération réussie',
                            text: 'Le commentaire a bien été modifié',
                        });
                    })
                    .catch((response) => {
                        this.commentEdit.pending = false;
                        this.commentEdit.error = response.user_message;
                    });
            },
            cancelEditComment() {
                setTimeout(() => {
                    if (this.commentEdit.pending !== false) {
                        return;
                    }

                    this.commentEdit.commentId = null;
                    this.commentEdit.value = null;
                    this.commentEdit.pending = false;
                    this.commentEdit.error = null;
                }, 100);
            },

            canEditComment(comment) {
                return hasPermission('shantytown_comment.create') || (comment.createdBy.id === this.userId);
            },
            canDeleteComment(comment) {
                return hasPermission('shantytown_comment.delete') || (comment.createdBy.id === this.userId);
            },
            editComment(comment) {
                this.commentEdit.commentId = comment.id;
                this.commentEdit.value = comment.description;
                this.commentEdit.pending = false;
                this.commentEdit.error = null;
            }
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
