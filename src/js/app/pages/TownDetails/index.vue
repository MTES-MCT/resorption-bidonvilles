<template>
    <div>
        <NavBar></NavBar>

        <section v-if="loading || error" class="section section-white">
            <div class="container" v-if="loading || error">
                <div v-if="loading">
                    <!-- LOADING STATE -->
                    <div class="notification full-width">
                        <img src="/img/spinner_dark.svg" width="20" class="spinner" />
                        <span>Chargement des données en cours...</span>
                    </div>
                </div>

                <div v-else-if="error">
                    <!-- ERROR STATE -->
                    <div class="notification error full-width">
                        <span>{{ error }}. <a href="#" @click="fetchData">Réessayer ?</a></span>
                    </div>
                </div>
            </div>
        </section>

        <section v-else class="section section-white town-wrapper" ref="wrapper">
            <CommentDeletion v-if="commentToBeDeleted !== null" :comment="commentToBeDeleted" @close="closeCommentDeletion" @deleted="onCommentDeleted" ref="commentDeletionPopin"></CommentDeletion>

            <TownClosePopin v-if="mode === 'close'" :fieldErrors="fieldErrors" :edit="edit" :editError="editError" :submitClose="submitClose" :closePopin="closePopin"></TownClosePopin>

            <header class="town-header" ref="header">
                <div class="container">
                    <div class="town-name">
                        <div class="town-reference">
                            <h1>Site {{ town.addressSimple }} <span :class="`town-status ${town.status}`">{{ status }}</span></h1>
                            <h2>{{ town.city.name }}</h2>
                        </div>

                        <div class="town-actionButtons">
                            <button v-if="town.status === 'open' && mode !== 'edit' && hasPermission('shantytown.close', town)" @click="setCloseMode" class="button secondary">Fermer le site</button>
                            <button v-if="town.status === 'open' && mode !== 'edit' && hasPermission('shantytown.update', town)" @click="setEditMode" class="button">Modifier le site</button>
                            <button v-if="mode !== 'edit' && hasPermission('shantytown.delete', town)" @click="destroy" class="button warning">Supprimer le site</button>
                            <button v-if="mode === 'edit'" @click="submit" class="button">Sauvegarder</button>
                            <button v-if="mode === 'edit'" @click="setViewMode" class="button warning">Annuler</button>
                        </div>
                    </div>

                    <div class="town-info">
                        <p class="town-links" v-if="town.changelog.length > 0">
                            <span class="link" @click="showAside('changelog')" data-group="sidePanelLink"><font-awesome-icon icon="history"></font-awesome-icon> &nbsp;Modifié le {{ formatDate(town.updatedAt, 'd M y') }} - voir l'historique</span>
                        </p>
                        <p class="town-links" v-if="hasPermission('shantytown_comment.list', town)">
                            <span class="link" @click="showAside('comments')" data-group="sidePanelLink"><font-awesome-icon icon="comment"></font-awesome-icon> &nbsp;{{ town.comments.regular.length }} commentaire{{ town.comments.regular.length > 1 ? 's' : '' }}</span>
                        </p>
                        <p class="town-links town-links--covid" v-if="hasPermission('covid_comment.list')">
                            <span class="link" @click="showAside('covidComments')" data-group="sidePanelLink"><font-awesome-icon icon="comment"></font-awesome-icon> &nbsp;{{ town.comments.covid.length }} commentaire{{ town.comments.covid.length > 1 ? 's' : '' }} COVID-19</span>
                        </p>
                    </div>
                </div>
            </header>

            <div class="town-main" ref="main">
                <div class="sidepanel" v-bind:class="{ 'sidepanel--visible': sidePanel !== null }">
                    <div class="sidepanel-shadow"></div>

                    <div class="sidepanel-wrapper" ref="aside">
                        <div class="sidepanel-actions">
                            <span @click="hideAside"><font-awesome-icon icon="times" size="2x"></font-awesome-icon></span>
                        </div>

                        <div v-if="sidePanel === 'changelog'">
                            <TownSidebarChangelog :town="town" />
                        </div>

                        <div v-else-if="sidePanel === 'comments'">
                            <TownSidebarComments :town="town" />
                        </div>

                        <div v-else-if="sidePanel === 'covidComments'">
                            <TownSidebarCovidComments :town="town" />
                        </div>

                    </div>
                </div>

                <!-- SUCCESS STATE -->
                <div class="container">
                    <div class="notification error full-width" v-if="deleteError !== null">
                        <span>{{ deleteError }}</span>
                    </div>



                    <div v-if="view === 'details'">
                        <div v-if="mode === 'view'">
                            <TownDetailsPanel :town="town" />
                        </div>

                        <div v-if="mode === 'edit'">
                            <TownEdit :edit="edit" :editError="editError" :editError="editError" :submit="submit"></TownEdit>
                        </div>

                    </div>

                    <!-- actions -->
                    <div v-else-if="view === 'actions'">
                        <div class="panel" v-for="action in town.actions">
                            <div class="panel__header">
                                <h3><router-link :to="'/action/' + action.id">{{ action.name }}</router-link> - <small class="panel__header-extra">Débutée le {{ formatDate(action.startedAt) }}</small></h3>
                            </div>
                            <p><strong>Type de l'action :</strong> {{ action.type }}</p>
                            <p><strong>Détails de l'action :</strong></p>
                            <p>{{ action.description || 'Aucun détails fournis' }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
    import simplebar from 'simplebar-vue';
    import Datepicker from 'vuejs-datepicker';
    import { fr } from 'vuejs-datepicker/dist/locale';
    import NavBar from '#app/layouts/navbar/navbar.vue';
    import Map from '#app/components/map/map.vue';
    import AddressWithLocation from '#app/components/form/input/address-with-location/address-with-location.vue';
    import CommentDeletion from '#app/components/comment-deletion/comment-deletion.vue';
    import {
        get, edit, destroy, close
    } from '#helpers/api/town';
    import { get as getConfig, hasPermission } from '#helpers/api/config';
    import { notify } from '#helpers/notificationHelper';
    import FormPanel from '#app/components/form/formPanel.vue';
    import TownClosePopin from './TownClosePopin';
    import TownDetailsPanel from './TownDetailsPanel';
    import TownEdit from './TownEdit';
    import TownSidebarChangelog from './TownSidebarChangelog';
    import TownSidebarComments from './TownSidebarComments';
    import TownSidebarCovidComments from './TownSidebarCovidComments';

    function boolToYesNoValue(bool) {
        if (bool === true) {
            return 1;
        }

        if (bool === false) {
            return 0;
        }

        return -1;
    }

    export default {
        components: {
            NavBar,
            Map,
            AddressWithLocation,
            Datepicker,
            simplebar,
            CommentDeletion,
            FormPanel,
            TownClosePopin,
            TownDetailsPanel,
            TownEdit,
            TownSidebarChangelog,
            TownSidebarComments,
            TownSidebarCovidComments
        },
        data() {
            return {
                userId: getConfig().user.id,
                loading: false,
                error: null,
                town: null,
                view: 'details',
                mode: 'view',
                editError: null,
                deleteError: null,
                fieldErrors: {},
                electricityTypes: getConfig().electricity_types,
                fieldTypes: getConfig().field_types,
                ownerTypes: getConfig().owner_types,
                socialOrigins: getConfig().social_origins,
                closingSolutions: getConfig().closing_solutions,
                dateLanguage: fr,
                yesnoValues: [
                    { value: 1, label: 'Oui' },
                    { value: 0, label: 'Non' },
                    { value: -1, label: 'Inconnu' },
                ],


                diagnosisValues: [
                    { value: 'none', label: 'Non prévu' },
                    { value: 'scheduled', label: 'Prévu' },
                    { value: 'done', label: 'Réalisé' },
                    { value: null, label: 'Inconnu' },
                ],
                cfpValues: [
                    { value: 'none', label: 'Non demandé' },
                    { value: 'requested', label: 'Demandé' },
                    { value: 'granted', label: 'Obtenu' },
                    { value: null, label: 'Inconnu' },
                ],

                sidePanel: null,

                edit: null,
                asideTimeout: null,
                commentToBeDeleted: null,
            };
        },
        computed: {
            status() {
                if (this.town === null) {
                    return null;
                }

                switch (this.town.status) {
                    case 'open':
                        return 'existe';

                    case 'closed_by_justice':
                    case 'closed_by_admin':
                    case 'other':
                    case 'unknown':
                        return this.town.closedWithSolutions === 'yes' ? 'résorbé' : 'disparu';

                    default:
                        return 'inconnu';
                }
            },
        },
        mounted() {
            this.scroll = window.pageYOffset;
            window.addEventListener('scroll', this.stickTheHeader);
        },
        destroyed() {
            window.removeEventListener('scroll', this.stickTheHeader);
            document.body.removeEventListener('click', this.checkClickOutsideAside);
        },
        created() {
            this.fetchData();
        },
        methods: {
            showAside(content) {
                this.sidePanel = content;
                this.asideTimeout = setTimeout(() => {
                    document.body.addEventListener('click', this.checkClickOutsideAside);
                }, 100);
            },
            hideAside() {
                clearTimeout(this.asideTimeout);
                this.sidePanel = null;
                document.body.removeEventListener('click', this.checkClickOutsideAside);
            },
            checkClickOutsideAside(event) {
                if ((!this.$refs.commentDeletionPopin || !this.$refs.commentDeletionPopin.$el.contains(event.target))
                    && !this.$refs.aside.contains(event.target)
                    && event.target.dataset.group !== 'sidePanelLink') {
                    this.hideAside();
                }
            },
            hasPermission: permissionName => hasPermission(permissionName),
            offsetTop(el) {
                let next = el;
                let offset = 0;
                while (next !== null) {
                    offset += next.offsetTop;
                    next = next.offsetParent;
                }

                return offset;
            },
            stickTheHeader() {
                const goesUp = window.pageYOffset < this.scroll;
                this.scroll = window.pageYOffset;

                if (goesUp === true) {
                    if (window.pageYOffset - this.$refs.main.offsetTop <= 0) {
                        this.$refs.wrapper.classList.remove('sticky');
                    }
                } else if (window.pageYOffset > this.offsetTop(this.$refs.header)) {
                    this.$refs.wrapper.classList.add('sticky');
                }
            },

            fetchData() {
                if (this.loading === true) {
                    return;
                }

                this.loading = true;
                this.error = null;

                get(this.$route.params.id)
                    .then((town) => {
                        this.loading = false;
                        this.town = town;
                        this.resetEdit();
                    })
                    .catch((errors) => {
                        this.error = errors.user_message;
                        this.loading = false;
                    });
            },
            setViewMode() {
                this.mode = 'view';
            },
            setEditMode() {
                if (!hasPermission('shantytown.update')) {
                    return;
                }

                this.setView('details');
                this.resetEdit();
                this.mode = 'edit';
            },
            setCloseMode() {
                if (!hasPermission('shantytown.close')) {
                    return;
                }

                this.resetEdit();
                this.mode = 'close';
            },
            closePopin() {
                this.resetEdit();
                this.mode = 'view';
            },
            resetEdit() {
                this.editError = null;
                this.fieldErrors = {};

                if (this.town === null) {
                    this.edit = null;
                    return;
                }

                this.edit = {
                    priority: this.town.priority,
                    address: {
                        address: {
                            city: this.town.city.name,
                            citycode: this.town.city.code,
                            label: this.town.address,
                        },
                        location: {
                            coordinates: [this.town.latitude, this.town.longitude],
                            zoom: 16,
                        },
                    },
                    addressDetails: this.town.addressDetails,
                    declaredAt: this.town.declaredAt !== null ? this.town.declaredAt * 1000 : null,
                    builtAt: this.town.builtAt !== null ? this.town.builtAt * 1000 : null,
                    closedAt: this.town.closedAt !== null ? this.town.closedAt * 1000 : null,
                    status: this.town.status !== 'open' ? this.town.status : null,
                    fieldType: this.town.fieldType.id,
                    ownerType: this.town.ownerType.id,
                    owner: this.town.owner,
                    ownerComplaint: boolToYesNoValue(this.town.ownerComplaint),
                    justiceProcedure: boolToYesNoValue(this.town.justiceProcedure),
                    justiceRendered: boolToYesNoValue(this.town.justiceRendered),
                    justiceRenderedBy: this.town.justiceRenderedBy,
                    justiceRenderedAt: this.town.justiceRenderedAt !== null ? this.town.justiceRenderedAt * 1000 : null,
                    justiceChallenged: boolToYesNoValue(this.town.justiceChallenged),
                    policeStatus: this.town.policeStatus,
                    policeRequestedAt: this.town.policeRequestedAt !== null ? this.town.policeRequestedAt * 1000 : null,
                    policeGrantedAt: this.town.policeGrantedAt !== null ? this.town.policeGrantedAt * 1000 : null,
                    bailiff: this.town.bailiff,
                    censusStatus: this.town.censusStatus,
                    censusConductedAt: this.town.censusConductedAt !== null ? this.town.censusConductedAt * 1000 : null,
                    censusConductedBy: this.town.censusConductedBy,
                    populationTotal: this.town.populationTotal,
                    populationCouples: this.town.populationCouples,
                    populationMinors: this.town.populationMinors,
                    origins: this.town.socialOrigins.map(origin => origin.id),
                    electricityType: this.town.electricityType.id,
                    electricityComments: this.town.electricityComments || '',
                    accessToSanitary: boolToYesNoValue(this.town.accessToSanitary),
                    sanitaryComments: this.town.sanitaryComments || '',
                    accessToWater: boolToYesNoValue(this.town.accessToWater),
                    waterComments: this.town.waterComments || '',
                    trashEvacuation: boolToYesNoValue(this.town.trashEvacuation),
                    solutions: this.town.closingSolutions ? this.closingSolutions.reduce((solutions, solution) => {
                        const newSolutions = Object.assign(solutions, {});
                        const s = this.town.closingSolutions.find(sol => sol.id === solution.id);
                        newSolutions[solution.id] = {
                            checked: s !== undefined,
                            peopleAffected: s && s.peopleAffected,
                            householdsAffected: s && s.householdsAffected,
                        };

                        return newSolutions;
                    }, {}) : [],
                };
            },
            setView(view) {
                this.setViewMode();
                this.view = view;
            },

            submit() {
                // clean previous errors
                this.editError = null;
                this.fieldErrors = {};

                // send the form
                const coordinates = this.edit.address && this.edit.address.location && this.edit.address.location.coordinates;
                const { address } = this.edit.address || {};

                edit(this.town.id, {
                    priority: this.edit.priority || null,
                    latitude: coordinates && coordinates[0],
                    longitude: coordinates && coordinates[1],
                    city: address && address.city,
                    citycode: address && address.citycode,
                    address: address && address.label,
                    detailed_address: this.edit.addressDetails,
                    declared_at: this.edit.declaredAt,
                    built_at: this.edit.builtAt,
                    closed_at: this.edit.closedAt,
                    status: 'open',
                    census_status: this.edit.censusStatus,
                    census_conducted_at: ['scheduled', 'done'].indexOf(this.edit.censusStatus) !== -1 ? this.edit.censusConductedAt : null,
                    census_conducted_by: ['scheduled', 'done'].indexOf(this.edit.censusStatus) !== -1 ? this.edit.censusConductedBy : '',
                    population_total: this.edit.populationTotal,
                    population_couples: this.edit.populationCouples,
                    population_minors: this.edit.populationMinors,
                    electricity_type: this.edit.electricityType,
                    electricity_comments: this.edit.electricityComments,
                    access_to_sanitary: this.edit.accessToSanitary,
                    sanitary_comments: this.edit.sanitaryComments,
                    access_to_water: this.edit.accessToWater,
                    water_comments: this.edit.waterComments,
                    trash_evacuation: this.edit.trashEvacuation,
                    owner_complaint: this.edit.ownerComplaint,
                    justice_procedure: this.edit.ownerComplaint === 1 ? this.edit.justiceProcedure : undefined,
                    justice_rendered: this.edit.ownerComplaint === 1
                    && this.edit.justiceProcedure === 1 ? this.edit.justiceRendered : undefined,
                    justice_rendered_by: this.edit.ownerComplaint === 1
                    && this.edit.justiceProcedure === 1
                    && this.edit.justiceRendered === 1 ? this.edit.justiceRenderedBy : '',
                    justice_rendered_at: this.edit.ownerComplaint === 1
                    && this.edit.justiceProcedure === 1
                    && this.edit.justiceRendered === 1 ? this.edit.justiceRenderedAt : null,
                    justice_challenged: this.edit.ownerComplaint === 1
                    && this.edit.justiceProcedure === 1
                    && this.edit.justiceRendered === 1 ? this.edit.justiceChallenged : undefined,
                    police_status: this.edit.policeStatus,
                    police_requested_at: ['requested', 'granted'].indexOf(this.edit.policeStatus) !== -1 ? this.edit.policeRequestedAt : null,
                    police_granted_at: ['granted'].indexOf(this.edit.policeStatus) !== -1 ? this.edit.policeGrantedAt : null,
                    bailiff: this.edit.bailiff,
                    social_origins: this.edit.origins,
                    field_type: this.edit.fieldType,
                    owner_type: this.edit.ownerType,
                    owner: this.edit.owner,
                })
                    .then(() => {
                        notify({
                            group: 'notifications',
                            type: 'success',
                            title: 'Site correctement sauvegardé',
                            text: 'Le site a bien été modifié',
                        });

                        this.loading = true;
                        this.error = null;

                        return get(this.$route.params.id)
                            .then((town) => {
                                this.loading = false;
                                this.town = town;
                                this.setViewMode();
                                this.resetEdit();
                            })
                            .catch((errors) => {
                                this.error = errors.user_message;
                                this.loading = false;
                            });
                    })
                    .catch((response) => {
                        this.editError = response.user_message;
                        this.fieldErrors = response.fields || {};
                    });
            },
            submitClose() {
                // clean previous errors
                this.editError = null;
                this.fieldErrors = {};

                // send the form
                close(this.town.id, {
                    closed_at: this.edit.closedAt,
                    closed_with_solutions: this.edit.closedWithSolutions,
                    status: this.edit.status,
                    solutions: Object.keys(this.edit.solutions)
                        .filter(key => this.edit.solutions[key].checked)
                        .map(key => ({
                            id: key,
                            peopleAffected: this.edit.solutions[key].peopleAffected ? parseInt(this.edit.solutions[key].peopleAffected, 10) : null,
                            householdsAffected: this.edit.solutions[key].householdsAffected ? parseInt(this.edit.solutions[key].householdsAffected, 10) : null,
                        })),
                })
                    .then(() => {
                        notify({
                            group: 'notifications',
                            type: 'success',
                            title: 'Site correctement fermé',
                            text: 'Le site a bien été marqué comme fermé',
                        });

                        this.loading = true;
                        this.error = null;

                        return get(this.$route.params.id)
                            .then((town) => {
                                this.loading = false;
                                this.town = town;
                                this.setViewMode();
                                this.resetEdit();
                            })
                            .catch((errors) => {
                                this.error = errors.user_message;
                                this.loading = false;
                            });
                    })
                    .catch((response) => {
                        this.editError = response.user_message;
                        this.fieldErrors = response.fields || {};
                    });
            },
            destroy() {
                // eslint-disable-next-line
                const confirmed = confirm('Êtes-vous sûr ? Cette suppression est irréversible');

                if (confirmed === true) {
                    destroy(this.$route.params.id)
                        .then(() => {
                            this.$router.push('/liste-des-sites');
                        })
                        .catch((error) => {
                            this.deleteError = error.user_message;
                        });
                }
            },



            closeCommentDeletion() {
                setTimeout(() => {
                    this.commentToBeDeleted = null;
                }, 100);
            },
            onCommentDeleted() {
                this.town.comments.regular = this.town.comments.regular.filter(({ id }) => id !== this.commentToBeDeleted.id);
                this.commentToBeDeleted = null;

                notify({
                    group: 'notifications',
                    type: 'success',
                    title: 'Commentaire supprimé',
                    text: 'L\'auteur du commentaire en a été notifié par email',
                });
            },

            formatDate: (...args) => App.formatDate(...args),
        },
    };

</script>

<style lang="scss">
    @import '/css/config/colors.scss';

    .sticky {
        .town-header {
            z-index: 3000;
            position: fixed;
            top: 0;
            left: 0;
            margin-top: 0;
            margin-bottom: 0;
            width: 100%;
            background: white;
        }

        .town-main {
            padding-top: 174px;
        }
    }



    .town-wrapper {
        margin-top: 10px;
    }

    .town-header {
        .container {
            padding-top: 20px;
            margin-top: 0px;
            margin-bottom: 20px;
        }
    }

    .town-name {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .town-actionButtons {
        display: flex;
        display: -webkit-box;
        display: -ms-flexbox;

        flex-direction: column;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        -ms-flex-direction: column;

        > button {
            display: block;
            margin-bottom: 8px;
        }
    }

    @media (min-width: 1200px) {
        .town-actionButtons {
            > button {
                display: inline-block;
                margin-bottom: 0;
            }
        }
    }

    .town-reference {
        color: #26353F;
        font-weight: bold;
    }

    .town-reference > h1,
    .town-reference > h2 {
        margin: 0;
        padding: 0;
    }

    .town-reference > h1 {
        font-size: 28px;
        letter-spacing: -0.05em;
    }

    .town-reference > h2 {
        font-size: 18px;
    }

    .town-reference > p {
        margin: 8px 0 10px;
        padding: 0;

        > span {
            margin-right: 15px;
        }
    }

    .town-status {
        padding: 2px 10px;
        font-weight: normal;
        vertical-align: middle;
        font-size: 0.5em;
        background: #efaca6;
        letter-spacing: 0;
        border-radius: 3px;

        &.open {
            background: #daf5e7;
        }
    }

    .town-links {
        display: inline-block;
        margin-right: 15px;
        color: $ENDEAVOUR_BLUE;
        font-weight: bold;
    }

    .town-links--covid {
        .link {
            color: $RED;
        }
    }

    .covid-header,
    .comment-form p.covid-header {
        margin-top: 30px;
        margin-bottom: 10px;
    }

    .town-main {
        position: relative;
        padding-top: 35px;
        background: #EBEFF3;
        padding-bottom: 100px;
        overflow: hidden;
    }

    .panel .form__group > label,
    .panel .form__group fieldset > legend {
        font-weight: bold;
    }

    .vdp-datepicker input {
        max-width: 300px;
    }

    .panel input[type="number"] {
        max-width: 100px;
    }

    legend.error {
        font-weight: bold;
        color: #d63626;
    }

    p.error {
        margin-top: 0;

        & > ul {
            margin-top: 0;
            padding-left: 20px;
            color: #d63626;
        }
    }

    .side-menu {
        min-width: 220px;
        max-width: 220px;

        > ul {
            position: fixed;
            width: 220px;

            > li.side-menu-button {
                margin-top: 20px;
                text-align: center;

                > .button {
                    width: 85%;
                }
            }
        }
    }



    fieldset {
        flex-wrap: wrap;
    }


</style>
