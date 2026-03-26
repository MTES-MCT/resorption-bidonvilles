import dateUtils from '#server/utils/date';
import Action from '#root/types/resources/Action.d';

const { fromTsToFormat } = dateUtils;

function formatAmount(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 0,
        useGrouping: true,
    }).format(amount);
}

export type Diff = {
    fieldKey: string,
    field: string,
    oldValue: string,
    newValue: string
};

function getDeepProperty(obj: any, path: string): any {
    return path.split('.').reduce((acc, curr) => acc?.[curr], obj);
}

export default function getDiff(oldVersion: Action, newVersion: Action): Diff[] {
    const baseProcessors = {
        default(value: any): string {
            if (value === null || value === '' || value === undefined) {
                return 'non renseigné';
            }
            return String(value);
        },
        date(ts: number | null): string {
            if (ts === null) {
                return 'non renseignée';
            }
            // Les dates sont en millisecondes (depuis serializeAction), fromTsToFormat attend des secondes
            return fromTsToFormat(ts / 1000, 'd M Y');
        },
        user(user: any): string {
            if (!user) {
                return 'non renseigné';
            }
            return `${user.first_name} ${user.last_name} (${user.organization.name})`;
        },
        userList(users: any[]): string {
            if (!users || users.length === 0) {
                return 'non renseigné';
            }
            return users.map(u => `${u.name || u.abbreviation || 'Organisation inconnue'}`).join(', ');
        },
        topicList(topics: any[]): string {
            if (!topics || topics.length === 0) {
                return 'non renseignées';
            }
            return topics.map(t => t.name).join(', ');
        },
        shantytownList(shantytowns: any[]): string {
            if (!shantytowns || shantytowns.length === 0) {
                return 'non renseignés';
            }
            return shantytowns.map(s => s.usename || s.name || `Site #${s.id}`).join(', ');
        },
        finances(finances: any): string {
            if (!finances || Object.keys(finances).length === 0) {
                return 'non renseignés';
            }
            const years = Object.keys(finances).sort();
            return years.map((year) => {
                const yearFinances = finances[year];
                const total = yearFinances.reduce((sum: number, f: any) => sum + (f.amount || 0), 0);
                // Arrondir à 2 décimales pour éviter les problèmes de précision
                const roundedTotal = Math.round(total * 100) / 100;
                return `${year}: ${roundedTotal}€`;
            }).join(', ');
        },
        metrics(metrics: any[]): string {
            if (!metrics || metrics.length === 0) {
                return 'non renseignés';
            }
            return `${metrics.length} saisie${metrics.length > 1 ? 's' : ''}`;
        },
    };

    const toDiff: { [key: string]: { label: string, processor?: (value: any) => string } } = {
        name: {
            label: "Nom de l'action",
        },
        started_at: {
            label: 'Date de début',
            processor: baseProcessors.date,
        },
        ended_at: {
            label: 'Date de fin',
            processor: baseProcessors.date,
        },
        goals: {
            label: 'Objectifs',
        },
        'location.departement.name': {
            label: 'Département',
        },
        location_type: {
            label: 'Type de localisation',
            processor(value: string): string {
                const types: { [key: string]: string } = {
                    logement: 'Logement',
                    eti: 'Établissement Temporaire d\'Insertion',
                    sur_site: 'Sur site',
                    autre: 'Autre',
                };
                return types[value] || value;
            },
        },
        'eti.address': {
            label: 'Adresse',
        },
        'eti.latitude': {
            label: 'Latitude',
        },
        'eti.longitude': {
            label: 'Longitude',
        },
        location_other: {
            label: 'Autre localisation',
        },
        topics: {
            label: 'Thématiques',
            processor: baseProcessors.topicList,
        },
        managers: {
            label: 'Pilotes',
            processor: baseProcessors.userList,
        },
        operators: {
            label: 'Intervenants',
            processor: baseProcessors.userList,
        },
        location_shantytowns: {
            label: 'Sites concernés',
            processor: baseProcessors.shantytownList,
        },
        finances: {
            label: 'Financements',
            processor: baseProcessors.finances,
        },
        metrics: {
            label: 'Indicateurs',
            processor: baseProcessors.metrics,
        },
    };

    const result: Diff[] = [];

    Object.keys(toDiff).forEach((serializedKey) => {
        const config = toDiff[serializedKey];
        const processor = config.processor ?? baseProcessors.default;

        const oldValue = getDeepProperty(oldVersion, serializedKey);
        const newValue = getDeepProperty(newVersion, serializedKey);

        // Traitement spécial pour les finances : comparer type par type, année par année
        if (serializedKey === 'finances') {
            const oldFinances = oldValue || {};
            const newFinances = newValue || {};
            const oldYears = Object.keys(oldFinances);
            const newYears = Object.keys(newFinances);
            const allYears = [...new Set([...oldYears, ...newYears])].sort((a, b) => a.localeCompare(b));

            allYears.forEach((year) => {
                const oldYearFinances = oldFinances[year] || [];
                const newYearFinances = newFinances[year] || [];

                // Créer un map des financements par type
                const oldByType = new Map();
                oldYearFinances.forEach((f: any) => {
                    const typeUid = f.type?.uid || 'unknown';
                    oldByType.set(typeUid, {
                        amount: f.amount || 0,
                        typeName: f.type?.name || 'Type inconnu',
                    });
                });

                const newByType = new Map();
                newYearFinances.forEach((f: any) => {
                    const typeUid = f.type?.uid || 'unknown';
                    newByType.set(typeUid, {
                        amount: f.amount || 0,
                        typeName: f.type?.name || 'Type inconnu',
                    });
                });

                // Comparer type par type
                const allTypes = new Set([...oldByType.keys(), ...newByType.keys()]);
                allTypes.forEach((typeUid) => {
                    const oldFinance = oldByType.get(typeUid);
                    const newFinance = newByType.get(typeUid);

                    const oldAmount = oldFinance ? Math.round(oldFinance.amount * 100) / 100 : 0;
                    const newAmount = newFinance ? Math.round(newFinance.amount * 100) / 100 : 0;
                    const typeName = newFinance?.typeName || oldFinance?.typeName || 'Type inconnu';

                    if (oldAmount !== newAmount) {
                        result.push({
                            fieldKey: `finances.${year}.${typeUid}`,
                            field: `Financement ${year} - ${typeName}`,
                            oldValue: oldAmount > 0 ? `${formatAmount(oldAmount)} €` : 'non renseigné',
                            newValue: newAmount > 0 ? `${formatAmount(newAmount)} €` : 'non renseigné',
                        });
                    }
                });
            });
        } else {
            const oldProcessed = processor(oldValue);
            const newProcessed = processor(newValue);

            if (oldProcessed !== newProcessed) {
                result.push({
                    fieldKey: serializedKey,
                    field: config.label,
                    oldValue: oldProcessed,
                    newValue: newProcessed,
                });
            }
        }
    });

    return result;
}
