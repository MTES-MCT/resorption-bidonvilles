import simplebar from 'simplebar-vue';
import { hasPermission } from '#helpers/api/config';
import { open } from '#helpers/tabHelper';

export default {
    components: {
        simplebar,
    },
    props: {
        town: Object,
        origin: Event, // this event is the one that caused that quick-view to appear
    },
    computed: {
        active() {
            return !!this.town;
        },
        caracteristicSection() {
            if (!this.town) {
                return null;
            }

            const rows = [];
            if (this.town.fieldType !== undefined) {
                rows.push({
                    label: 'Type de site',
                    value: this.town.fieldType.label,
                });
            }
            if (this.town.ownerType !== undefined) {
                rows.push({
                    label: 'Type de propriétaire',
                    value: this.town.ownerType.label,
                });
            }
            if (this.town.builtAt !== undefined) {
                rows.push({
                    label: 'Date d\'installation',
                    value: this.town.builtAt ? App.formatDate(this.town.builtAt) : 'Inconnue',
                });
            }

            if (rows.length === 0) {
                return null;
            }

            return {
                title: 'Caractéristiques',
                rows,
            };
        },
        demographySection() {
            if (!this.town) {
                return null;
            }

            const rows = [];
            if (this.town.populationTotal !== undefined) {
                rows.push({
                    label: 'Nombre de personnes',
                    value: this.town.populationTotal !== null ? this.town.populationTotal : 'inconnu',
                });
            }
            if (this.town.populationCouples !== undefined) {
                rows.push({
                    label: 'Nombre de ménages',
                    value: this.town.populationCouples !== null ? this.town.populationCouples : 'inconnu',
                });
            }
            if (this.town.populationMinors !== undefined) {
                rows.push({
                    label: 'Nombre de mineurs',
                    value: this.town.populationMinors !== null ? this.town.populationMinors : 'inconnu',
                });
            }
            if (this.town.socialOrigins !== undefined) {
                rows.push({
                    label: 'Origines',
                    value: this.town.socialOrigins.length > 0 ? '' : 'inconnu',
                });

                this.town.socialOrigins.forEach((socialOrigin) => {
                    rows.push({
                        value: socialOrigin.label,
                    });
                });
            }

            if (rows.length === 0) {
                return null;
            }

            return {
                title: 'Démographie',
                rows,
            };
        },
        justiceSection() {
            if (!this.town) {
                return null;
            }

            const rows = [];
            const boolConverter = {
                [true]: 'oui',
                [false]: 'non',
            };
            if (this.town.justiceProcedure !== undefined) {
                rows.push({
                    label: 'Existence d\'une procédure judiciaire',
                    value: boolConverter[this.town.justiceProcedure] || 'inconnu',
                });
            }
            if (this.town.justiceRendered !== undefined) {
                rows.push({
                    label: 'Décision de justice rendue',
                    value: boolConverter[this.town.justiceRendered] || 'inconnu',
                });
            }
            if (this.town.policeStatus !== undefined) {
                const converter = {
                    none: 'non demandé',
                    requested: 'demandé',
                    granted: 'obtenu',
                };
                rows.push({
                    label: 'Concours de la force publique demandé',
                    value: converter[this.town.policeStatus] || 'inconnu',
                });
            }

            if (rows.length === 0) {
                return null;
            }

            return {
                title: 'Procédure judiciaire d\'expulsion',
                rows,
            };
        },
        sections() {
            return [
                this.caracteristicSection,
                this.demographySection,
                this.justiceSection,
            ].filter(section => section !== null);
        },
    },
    mounted() {
        document.addEventListener('click', this.checkOutsideClick);
    },
    destroyed() {
        document.removeEventListener('click', this.checkOutsideClick);
    },
    methods: {
        hasPermission,
        formatDate: ts => App.formatDate(ts),
        checkOutsideClick(event) {
            if (!this.town) {
                return;
            }

            // ignore the origin event
            if (event === this.origin) {
                return;
            }

            // if the click was outside ourselves, share the info
            if (!this.$refs.quickviewPanel.$el.contains(event.target)) {
                this.$emit('outside-click', event);
            }
        },
        showTown() {
            const routerData = this.$router.resolve(`/site/${this.town.id}`);
            open(routerData.href);
        },
    },
};
