import { get, getPermission } from '#helpers/api/config';
import { setDefaultExport } from '#helpers/api/user';

const convertBool = {
    null: '',
    true: 'oui',
    false: 'non',
};

let columns = {
    status: {
        label: 'Statut du site',
        value: (town) => {
            const convertStatus = {
                open: 'ouvert',
                other: 'fermé (autre raison)',
                closed_by_justice: 'fermé (décision de justice)',
                closed_by_admin: 'fermé (décision administrative)',
                unknown: 'fermé (cause inconnue)',
            };
            return convertStatus[town.status];
        },
    },
    priority: {
        label: 'Priorité',
        value: town => (town.priority !== null ? town.priority : 'Inconnue'),
    },
    cityCode: {
        label: 'Ville (code insee)',
        value: town => town.city.code,
    },
    cityName: {
        label: 'Ville',
        value: town => town.city.name,
    },
    address: {
        label: 'Adresse',
        value: town => town.address || '',
    },
    addressDetails: {
        label: 'Informations d\'accès',
        value: town => town.addressDetails || '',
    },
    builtAt: {
        label: 'Date d\'installation',
        value: town => (town.builtAt ? App.formatDate(town.builtAt) : ''),
    },
    declaredAt: {
        label: 'Date de signalement',
        value: town => (town.declaredAt ? App.formatDate(town.declaredAt) : ''),
    },
    closedAt: {
        label: 'Date de fermeture',
        value: town => (town.closedAt ? App.formatDate(town.closedAt) : ''),
    },
    fieldType: {
        label: 'Type de terrain',
        value: town => (town.fieldType ? town.fieldType.label : ''),
    },
    ownerType: {
        label: 'Type de propriétaire',
        value: town => (town.ownerType ? town.ownerType.label : ''),
    },
    owner: {
        label: 'Identité de propriétaire',
        value: town => town.owner || '',
    },
    censusStatus: {
        label: 'Statut du diagnostic social',
        value: (town) => {
            const convertCensusStatus = {
                null: '',
                none: 'Non prévu',
                scheduled: 'Prévu',
                done: 'Réalisé',
            };
            return convertCensusStatus[town.censusStatus];
        },
    },
    censusConductedAt: {
        label: 'Date du diagnostic',
        value: town => (town.censusConductedAt ? App.formatDate(town.censusConductedAt) : ''),
    },
    censusConductedBy: {
        label: 'Service en charge du diagnostic',
        value: town => town.censusConductedBy || '',
    },
    populationTotal: {
        label: 'Nombre de personnes',
        value: town => town.populationTotal || '',
    },
    populationCouples: {
        label: 'Nombre de ménages',
        value: town => town.populationCouples || '',
    },
    populationMinors: {
        label: 'Nombre de mineurs',
        value: town => town.populationMinors || '',
    },
    socialOrigins: {
        label: 'Origines',
        value: town => town.socialOrigins.map(origin => origin.label).join(';') || '',
    },
    electricityType: {
        label: 'Accès à l\'électricité',
        value: town => town.electricityType.label,
    },
    accessToWater: {
        label: 'Accès à l\'eau',
        value: town => convertBool[town.accessToWater],
    },
    trashEvacuation: {
        label: 'Évacuation des déchets',
        value: town => convertBool[town.trashEvacuation],
    },
    ownerComplaint: {
        label: 'Dépôt de plainte par le propriétaire',
        value: town => convertBool[town.ownerComplaint],
        permissions: {
            'shantytown.export': ['data_justice'],
        },
    },
    justiceProcedure: {
        label: 'Existence d\'une procédure judiciaire',
        value: town => convertBool[town.justiceProcedure],
        permissions: {
            'shantytown.export': ['data_justice'],
        },
    },
    justiceRendered: {
        label: 'Décision de justice rendue',
        value: town => convertBool[town.justiceRendered],
        permissions: {
            'shantytown.export': ['data_justice'],
        },
    },
    justiceRenderedAt: {
        label: 'Date de la décision',
        value: town => (town.justiceRenderedAt ? App.formatDate(town.justiceRenderedAt) : ''),
        permissions: {
            'shantytown.export': ['data_justice'],
        },
    },
    justiceRenderedBy: {
        label: 'Origine de la décision',
        value: town => town.justiceRenderedBy || '',
        permissions: {
            'shantytown.export': ['data_justice'],
        },
    },
    justiceChallenged: {
        label: 'Contentieux relatif à la décision de justice',
        value: town => convertBool[town.justiceChallenged],
        permissions: {
            'shantytown.export': ['data_justice'],
        },
    },
    policeStatus: {
        label: 'Concours de la force publique',
        value: (town) => {
            const convertPoliceStatus = {
                null: 'Inconnu',
                none: 'Non demandé',
                requested: 'Demandé',
                granted: 'Obtenu',
            };
            return convertPoliceStatus[town.policeStatus];
        },
        permissions: {
            'shantytown.export': ['data_justice'],
        },
    },
    policeRequestedAt: {
        label: 'Date de la demande du CFP',
        value: town => (town.policeRequestedAt ? App.formatDate(town.policeRequestedAt) : ''),
        permissions: {
            'shantytown.export': ['data_justice'],
        },
    },
    policeGrantedAt: {
        label: 'Date d\'octroi du CFP',
        value: town => (town.policeGrantedAt ? App.formatDate(town.policeGrantedAt) : ''),
        permissions: {
            'shantytown.export': ['data_justice'],
        },
    },
    bailiff: {
        label: 'Étude d\'huissiers',
        value: town => town.bailiff || '',
        permissions: {
            'shantytown.export': ['data_justice'],
        },
    },
    updatedAt: {
        label: 'Site mis à jour le',
        value: town => (town.updatedAt ? App.formatDate(town.updatedAt) : ''),
    },
    comments: {
        label: 'Commentaires',
        value: (town) => {
            if (!town.comments || town.comments.length <= 0) {
                return '';
            }

            return town.comments.map(({ description }) => description).join('\n_\n');
        },
        permissions: {
            'shantytown_comment.list': [],
        },
    },
};

columns = Object.keys(columns).reduce((acc, key) => Object.assign(acc, {
    [key]: Object.assign(columns[key], { id: key }),
}), {});

const exportOrder = [
    'status',
    'priority',
    'cityCode',
    'cityName',
    'address',
    'addressDetails',
    'builtAt',
    'declaredAt',
    'closedAt',
    'fieldType',
    'ownerType',
    'owner',
    'censusStatus',
    'censusConductedAt',
    'censusConductedBy',
    'populationTotal',
    'populationCouples',
    'populationMinors',
    'socialOrigins',
    'electricityType',
    'accessToWater',
    'trashEvacuation',
    'ownerComplaint',
    'justiceProcedure',
    'justiceRendered',
    'justiceRenderedAt',
    'justiceRenderedBy',
    'justiceChallenged',
    'policeStatus',
    'policeRequestedAt',
    'policeGrantedAt',
    'bailiff',
    'updatedAt',
    'comments',
];

const sections = [
    {
        title: 'Caractéristiques',
        fields: [
            'status',
            'priority',
            'cityCode',
            'cityName',
            'address',
            'addressDetails',
            'builtAt',
            'declaredAt',
            'closedAt',
            'fieldType',
            'ownerType',
            'owner',
        ],
    },
    {
        title: 'Démographie',
        fields: [
            'censusStatus',
            'censusConductedAt',
            'censusConductedBy',
            'populationTotal',
            'populationCouples',
            'populationMinors',
            'socialOrigins',
        ],
    },
    {
        title: 'Conditions de vie',
        fields: [

            'electricityType',
            'accessToWater',
            'trashEvacuation',
        ],
    },
    {
        title: 'Procédure judiciaire d\'expulsion des occupants',
        fields: [
            'ownerComplaint',
            'justiceProcedure',
            'justiceRendered',
            'justiceRenderedAt',
            'justiceRenderedBy',
            'justiceChallenged',
            'policeStatus',
            'policeRequestedAt',
            'policeGrantedAt',
            'bailiff',
        ],
    },
    {
        title: 'Autres',
        fields: [
            'updatedAt',
            'comments',
        ],
    },
];

export default {
    props: {
        towns: Array,
    },
    data() {
        const defaultExport = get().user.default_export;

        return {
            columnStates: Object.keys(columns).reduce((acc, column) => Object.assign(acc, {
                [column]: defaultExport.indexOf(column) !== -1,
            }), {}),
            sectionStates: sections.reduce((acc, { title }) => Object.assign(acc, {
                [title]: true,
            }), {}),
        };
    },
    computed: {
        sections() {
            return sections.map(({ title, fields }) => ({
                title,
                fields: fields
                    .filter((field) => {
                        if (!columns[field].permissions) {
                            return true;
                        }

                        return Object.keys(columns[field].permissions).every((permissionName) => {
                            const permission = getPermission(permissionName);
                            return permission !== null && columns[field].permissions[permissionName].every(data => permission[data] === true);
                        });
                    })
                    .map(field => columns[field]),
            })).filter(section => section.fields.length > 0);
        },
    },
    mounted() {
        document.addEventListener('click', this.checkOutsideClick);
        this.sections.forEach(section => this.syncSection(section));
    },
    destroyed() {
        document.removeEventListener('click', this.checkOutsideClick);
    },
    methods: {
        onSectionToggle({ fields, title }) {
            fields.forEach(({ id }) => {
                this.columnStates[id] = this.sectionStates[title];
            });
        },
        onColumnToggle(section) {
            this.syncSection(section);
        },
        syncSection({ fields, title }) {
            this.sectionStates[title] = fields.every(({ id: columnId }) => this.columnStates[columnId]);
        },
        checkOutsideClick(event) {
            // ignore the origin event
            if (this.$refs.wrapper.offsetHeight === 0) {
                return;
            }

            if (!this.$refs.wrapper.contains(event.target)) {
                this.close();
            }
        },
        getAllowedColumns() {
            return exportOrder
                .filter((column) => {
                    if (!column.permissions) {
                        return true;
                    }

                    return Object.keys(column.permissions).every((permissionName) => {
                        const permission = getPermission(permissionName);
                        return permission !== null && column.permissions[permissionName].every(data => permission[data] === true);
                    });
                })
                .filter(column => this.columnStates[column])
                .map(column => columns[column]);
        },
        getData() {
            const allowedColumns = this.getAllowedColumns();
            return [
                allowedColumns.map(column => column.label).join(';'),
                ...this.towns.map(town => allowedColumns.map(column => `"${column.value(town).toString().replace(/"/g, '""')}"`).join(';')),
            ];
        },
        download() {
            const encodedUri = encodeURI(`data:text/csv;charset=utf-8,${this.getData().join('\n')}`);
            this.$refs.link.setAttribute('href', encodedUri);
            this.$refs.link.setAttribute('download', `export_bidonvilles_${App.formatDate(Date.now() / 1000, 'y_m_d')}.csv`);
            this.$refs.link.click();

            const selectedColumns = this.getAllowedColumns();
            setDefaultExport(selectedColumns.map(column => column.id).join(','));

            this.$emit('export');
        },
        close() {
            this.$emit('close');
        },
    },
};
