import { get, hasPermission } from '#helpers/api/config';
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
        value: town => town.priority,
        permissions: [
            { type: 'data', name: 'priority' },
        ],
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
        permissions: [
            { type: 'data', name: 'address' },
        ],
    },
    addressDetails: {
        label: 'Informations d\'accès',
        value: town => town.addressDetails || '',
        permissions: [
            { type: 'data', name: 'addressDetails' },
        ],
    },
    builtAt: {
        label: 'Date d\'installation',
        value: town => (town.builtAt ? App.formatDate(town.builtAt) : ''),
        permissions: [
            { type: 'data', name: 'builtAt' },
        ],
    },
    declaredAt: {
        label: 'Date de signalement',
        value: town => (town.declaredAt ? App.formatDate(town.declaredAt) : ''),
        permissions: [
            { type: 'data', name: 'declaredAt' },
        ],
    },
    closedAt: {
        label: 'Date de fermeture',
        value: town => (town.closedAt ? App.formatDate(town.closedAt) : ''),
        permissions: [
            { type: 'data', name: 'closedAt' },
        ],
    },
    fieldType: {
        label: 'Type de terrain',
        value: town => (town.fieldType ? town.fieldType.label : ''),
        permissions: [
            { type: 'data', name: 'fieldType' },
        ],
    },
    ownerType: {
        label: 'Type de propriétaire',
        value: town => (town.ownerType ? town.ownerType.label : ''),
        permissions: [
            { type: 'data', name: 'ownerType' },
        ],
    },
    owner: {
        label: 'Identité de propriétaire',
        value: town => town.owner || '',
        permissions: [
            { type: 'data', name: 'owner' },
        ],
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
        permissions: [
            { type: 'data', name: 'censusStatus' },
        ],
    },
    censusConductedAt: {
        label: 'Date du diagnostic',
        value: town => (town.censusConductedAt ? App.formatDate(town.censusConductedAt) : ''),
        permissions: [
            { type: 'data', name: 'censusConductedAt' },
        ],
    },
    censusConductedBy: {
        label: 'Service en charge du diagnostic',
        value: town => town.censusConductedBy || '',
        permissions: [
            { type: 'data', name: 'censusConductedBy' },
        ],
    },
    populationTotal: {
        label: 'Nombre de personnes',
        value: town => town.populationTotal || '',
        permissions: [
            { type: 'data', name: 'populationTotal' },
        ],
    },
    populationCouples: {
        label: 'Nombre de ménages',
        value: town => town.populationCouples || '',
        permissions: [
            { type: 'data', name: 'populationCouples' },
        ],
    },
    populationMinors: {
        label: 'Nombre de mineurs',
        value: town => town.populationMinors || '',
        permissions: [
            { type: 'data', name: 'populationMinors' },
        ],
    },
    socialOrigins: {
        label: 'Origines',
        value: town => town.socialOrigins.map(origin => origin.label).join(';') || '',
        permissions: [
            { type: 'data', name: 'socialOrigins' },
        ],
    },
    electricityType: {
        label: 'Accès à l\'électricité',
        value: town => town.electricityType.label,
        permissions: [
            { type: 'data', name: 'electricityType' },
        ],
    },
    accessToWater: {
        label: 'Accès à l\'eau',
        value: town => convertBool[town.accessToWater],
        permissions: [
            { type: 'data', name: 'accessToWater' },
        ],
    },
    trashEvacuation: {
        label: 'Évacuation des déchets',
        value: town => convertBool[town.trashEvacuation],
        permissions: [
            { type: 'data', name: 'trashEvacuation' },
        ],
    },
    ownerComplaint: {
        label: 'Dépôt de plainte par le propriétaire',
        value: town => convertBool[town.ownerComplaint],
        permissions: [
            { type: 'data', name: 'ownerComplaint' },
        ],
    },
    justiceProcedure: {
        label: 'Existence d\'une procédure judiciaire',
        value: town => convertBool[town.justiceProcedure],
        permissions: [
            { type: 'data', name: 'justiceProcedure' },
        ],
    },
    justiceRendered: {
        label: 'Décision de justice rendue',
        value: town => convertBool[town.justiceRendered],
        permissions: [
            { type: 'data', name: 'justiceRendered' },
        ],
    },
    justiceRenderedAt: {
        label: 'Date de la décision',
        value: town => (town.justiceRenderedAt ? App.formatDate(town.justiceRenderedAt) : ''),
        permissions: [
            { type: 'data', name: 'justiceRenderedAt' },
        ],
    },
    justiceRenderedBy: {
        label: 'Origine de la décision',
        value: town => town.justiceRenderedBy || '',
        permissions: [
            { type: 'data', name: 'justiceRenderedBy' },
        ],
    },
    justiceChallenged: {
        label: 'Contentieux relatif à la décision de justice',
        value: town => convertBool[town.justiceChallenged],
        permissions: [
            { type: 'data', name: 'justiceChallenged' },
        ],
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
        permissions: [
            { type: 'data', name: 'policeStatus' },
        ],
    },
    policeRequestedAt: {
        label: 'Date de la demande du CFP',
        value: town => (town.policeRequestedAt ? App.formatDate(town.policeRequestedAt) : ''),
        permissions: [
            { type: 'data', name: 'policeRequestedAt' },
        ],
    },
    policeGrantedAt: {
        label: 'Date d\'octroi du CFP',
        value: town => (town.policeGrantedAt ? App.formatDate(town.policeGrantedAt) : ''),
        permissions: [
            { type: 'data', name: 'policeGrantedAt' },
        ],
    },
    bailiff: {
        label: 'Étude d\'huissiers',
        value: town => town.bailiff || '',
        permissions: [
            { type: 'data', name: 'bailiff' },
        ],
    },
    updatedAt: {
        label: 'Site mis à jour le',
        value: town => (town.updatedAt ? App.formatDate(town.updatedAt) : ''),
        permissions: [
            { type: 'data', name: 'updatedAt' },
        ],
    },
    comments: {
        label: 'Commentaires',
        value: (town) => {
            if (!town.comments || town.comments.length <= 0) {
                return '';
            }

            return town.comments.map(({ description }) => description).join('\n_\n');
        },
        permissions: [
            { type: 'feature', name: 'readComment' },
        ],
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
                    .filter(field => !columns[field].permissions || columns[field].permissions.every(permission => hasPermission(permission)))
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
                .filter(column => !column.permissions || column.permissions.every(permission => hasPermission(permission)))
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
