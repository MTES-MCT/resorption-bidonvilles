import NavBar from '#app/layouts/navbar/navbar.vue';
import SlideNote from '#app/components/slide-note/slide-note.vue';
import Map from '#app/pages/townExplorer/map/map.vue';
import { get } from '#helpers/api/plan';
import { hasPermission, get as getConfig } from '#helpers/api/config';
import { shortAddress } from '#helpers/townHelper';

export default {
    components: {
        NavBar,
        SlideNote,
        Map,
    },

    data() {
        const { etp_types: etpTypes } = getConfig();

        return {
            status: null,
            error: null,
            plan: null,
            etpTypes,
            currentFinanceIndex: 0,
        };
    },

    created() {
        this.load();
    },

    computed: {
        reachedMaxFinanceIndex() {
            if (!this.plan || !this.plan.finances || this.plan.finances.length === 0) {
                return true;
            }

            return this.currentFinanceIndex === 0;
        },
        reachedMinFinanceIndex() {
            if (!this.plan || !this.plan.finances || this.plan.finances.length === 0) {
                return true;
            }

            return this.currentFinanceIndex >= this.plan.finances.length - 1;
        },
        availableEtpTypes() {
            return this.etpTypes.filter(({ uid }) => this.plan.states.some(({ etp }) => etp.some(({ type: { uid: u } }) => uid === u)));
        },
        address() {
            if (!this.plan.location) {
                return null;
            }

            return {
                latitude: this.plan.location.latitude,
                longitude: this.plan.location.longitude,
                address: this.plan.location.label,
            };
        },
        center() {
            if (!this.plan.location) {
                return null;
            }

            return {
                center: [this.plan.location.latitude, this.plan.location.longitude],
                zoom: 15,
            };
        },
        details() {
            if (!this.plan) {
                return [];
            }

            if (this.plan.targetedOnTowns === true) {
                return this.plan.towns.map(town => ({
                    id: town.detailId,
                    label: shortAddress(town),
                }));
            }

            return [
                {
                    id: 'details',
                    label: 'Suivi du dispositif',
                },
            ];
        },
        lastState() {
            if (!this.plan || this.plan.states.length === 0) {
                return null;
            }

            return this.plan.states.slice(-1)[0];
        },
        audience() {
            if (!this.plan || this.plan.states.length === 0) {
                return null;
            }

            function sum(originalObj, additionalObj) {
                return {
                    total: originalObj.total + additionalObj.total,
                    families: originalObj.families + additionalObj.families,
                    women: originalObj.women + additionalObj.women,
                    minors: originalObj.minors + additionalObj.minors,
                };
            }

            return this.plan.states.reduce((acc, { audience }) => {
                if (audience.in) {
                    acc.in = sum(acc.in, audience.in);
                }

                if (audience.out_positive) {
                    acc.out_positive = sum(acc.out_positive, audience.out_positive);
                }

                if (audience.out_abandoned) {
                    acc.out_abandoned = sum(acc.out_abandoned, audience.out_abandoned);
                }

                if (audience.out_excluded) {
                    acc.out_excluded = sum(acc.out_excluded, audience.out_excluded);
                }

                return acc;
            }, {
                in: {
                    total: 0, families: 0, women: 0, minors: 0,
                },
                out_positive: {
                    total: 0, families: 0, women: 0, minors: 0,
                },
                out_abandoned: {
                    total: 0, families: 0, women: 0, minors: 0,
                },
                out_excluded: {
                    total: 0, families: 0, women: 0, minors: 0,
                },
            });
        },
    },

    methods: {
        hasPermission,
        financeTotal() {
            if (!this.plan || !this.plan.finances) {
                return 0;
            }

            return this.plan.finances[this.currentFinanceIndex].data.reduce((total, { amount }) => total + parseFloat(amount), 0);
        },
        load() {
            if (['loading', 'loaded'].indexOf(this.status) !== -1) {
                return;
            }

            this.status = 'loading';
            this.error = null;

            get(this.$route.params.id)
                .then((data) => {
                    this.plan = data;
                    this.status = 'loaded';
                })
                .catch(({ user_message: message }) => {
                    this.error = message;
                    this.status = 'loadingError';
                });
        },
        escapeHtml(...args) {
            return App.escapeHtml(...args);
        },
        dateDiff(...args) {
            return App.dateDiff(...args);
        },
        formatDate(...args) {
            return App.formatDate(...args);
        },

        showPreviousYear() {
            if (this.reachedMinFinanceIndex) {
                return;
            }

            this.currentFinanceIndex += 1;
        },

        showNextYear() {
            if (this.reachedMaxFinanceIndex) {
                return;
            }

            this.currentFinanceIndex -= 1;
        },
    },
};
