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
            // Trier les organisations par nom pour éviter les faux positifs dus à l'ordre
            const orgNames = users
                .map(u => u.name || u.abbreviation || 'Organisation inconnue')
                .sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }));
            // Supprimer les doublons
            const uniqueOrgNames = [...new Set(orgNames)];
            return uniqueOrgNames.join(', ');
        },
        operatorList(operators: any[]): string {
            if (!operators || operators.length === 0) {
                return 'non renseigné';
            }
            // Trier par nom canonique (sans suffixe) pour éviter les faux positifs dus à l'ordre
            const orgEntries = operators
                .map(o => ({
                    canonicalName: o.name || o.abbreviation || 'Organisation inconnue',
                    isPrincipal: o.is_principal === true,
                }))
                .sort((a, b) => a.canonicalName.localeCompare(b.canonicalName, 'fr', { sensitivity: 'base' }));
            // Supprimer les doublons (par nom canonique + statut principal)
            const seen = new Set<string>();
            const uniqueEntries = orgEntries.filter((entry) => {
                const key = `${entry.canonicalName}|${entry.isPrincipal}`;
                if (seen.has(key)) {
                    return false;
                }
                seen.add(key);
                return true;
            });
            return uniqueEntries
                .map(entry => (entry.isPrincipal ? `${entry.canonicalName} (principal)` : entry.canonicalName))
                .join(', ');
        },
        topicList(topics: any[]): string {
            if (!topics || topics.length === 0) {
                return 'non renseignées';
            }
            return topics.map(t => `• ${t.name}`).join('\n');
        },
        shantytownList(shantytowns: any[]): string {
            if (!shantytowns || shantytowns.length === 0) {
                return 'non renseignés';
            }
            if (shantytowns.length === 1) {
                return shantytowns[0].usename || shantytowns[0].name || `Site #${shantytowns[0].id}`;
            }
            return shantytowns.map((s) => {
                const siteName = s.usename || s.name || `Site #${s.id}`;
                return `- ${siteName}`;
            }).join('\n');
        },
        finances(finances: any): string {
            if (!finances || Object.keys(finances).length === 0) {
                return 'non renseignés';
            }
            const years = Object.keys(finances).sort((a, b) => a.localeCompare(b));
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
            label: 'Nom du projet',
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
        eti: {
            label: 'Adresses ETI',
            processor(addresses: any[] | null): string {
                if (!addresses || addresses.length === 0) {
                    return 'non renseignées';
                }
                if (addresses.length === 1) {
                    return addresses[0].address;
                }
                return addresses.map(addr => addr.address).join(', ');
            },
        },
        location_eti_addresses: {
            label: 'Adresses ETI',
            processor(addresses: any[] | null): string {
                if (!addresses || addresses.length === 0) {
                    return 'non renseignées';
                }
                if (addresses.length === 1) {
                    return addresses[0].address;
                }
                return addresses.map(addr => addr.address).join('\n');
            },
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
            processor: baseProcessors.operatorList,
        },
        location_shantytowns: {
            label: 'Sites concernés',
            processor: baseProcessors.shantytownList,
        },
        finances: {
            label: 'Financements',
            processor: baseProcessors.finances,
        },
        indicateurs: {
            label: 'Indicateurs',
            processor: baseProcessors.metrics,
        },
    };

    const indicateursLabels: { [key: string]: string } = {
        nombre_personnes: 'Nombre de personnes',
        nombre_menages: 'Nombre de ménages',
        nombre_femmes: 'Nombre de femmes',
        nombre_mineurs: 'Nombre de mineurs',
        sante_nombre_personnes: 'Santé - Nombre de personnes',
        travail_nombre_personnes: 'Travail - Nombre de personnes',
        travail_nombre_femmes: 'Travail - Nombre de femmes',
        hebergement_nombre_personnes: 'Hébergement - Nombre de personnes',
        hebergement_nombre_menages: 'Hébergement - Nombre de ménages',
        logement_nombre_personnes: 'Logement - Nombre de personnes',
        logement_nombre_menages: 'Logement - Nombre de ménages',
        scolaire_mineurs_moins_de_trois_ans: 'Scolaire - Mineurs scolarisables de moins de 3 ans',
        scolaire_mineurs_trois_ans_et_plus: 'Scolaire - Mineurs scolarisables de 3 ans et plus',
        scolaire_mediation_moins_de_trois_ans: 'Scolaire - Mineurs en médiation de moins de 3 ans',
        scolaire_mediation_trois_ans_et_plus: 'Scolaire - Mineurs en médiation de 3 ans et plus',
        scolaire_nombre_maternelle: 'Scolaire - Nombre en maternelle',
        scolaire_nombre_elementaire: 'Scolaire - Nombre en élémentaire',
        scolaire_nombre_college: 'Scolaire - Nombre au collège',
        scolaire_nombre_lycee: 'Scolaire - Nombre au lycée',
        scolaire_nombre_autre: 'Scolaire - Nombre autre',
        scolaire_mineur_scolarise_dans_annee: 'Scolaire - Mineurs scolarisés dans l\'année',
    };

    const result: Diff[] = [];

    Object.keys(toDiff).forEach((serializedKey) => {
        const config = toDiff[serializedKey];
        const processor = config.processor ?? baseProcessors.default;

        const oldValue = getDeepProperty(oldVersion, serializedKey);
        const newValue = getDeepProperty(newVersion, serializedKey);

        // Traitement spécial pour les indicateurs : comparer champ par champ, année par année
        if (serializedKey === 'indicateurs') {
            const oldIndicateurs = oldValue || {};
            const newIndicateurs = newValue || {};
            const oldYears = Object.keys(oldIndicateurs);
            const newYears = Object.keys(newIndicateurs);
            const allYears = [...new Set([...oldYears, ...newYears])].sort((a, b) => a.localeCompare(b));

            allYears.forEach((year) => {
                const oldYearIndicateurs = oldIndicateurs[year] || {};
                const newYearIndicateurs = newIndicateurs[year] || {};

                // Comparer chaque champ d'indicateur
                Object.keys(indicateursLabels).forEach((fieldKey) => {
                    const oldFieldValue = oldYearIndicateurs[fieldKey];
                    const newFieldValue = newYearIndicateurs[fieldKey];

                    // Comparer les valeurs (null et undefined sont considérés comme équivalents)
                    const oldVal = oldFieldValue ?? null;
                    const newVal = newFieldValue ?? null;

                    if (oldVal !== newVal) {
                        result.push({
                            fieldKey: `indicateurs.${year}.${fieldKey}`,
                            field: `Indicateurs ${year} - ${indicateursLabels[fieldKey]}`,
                            oldValue: oldVal === null ? 'non renseigné' : String(oldVal),
                            newValue: newVal === null ? 'non renseigné' : String(newVal),
                        });
                    }
                });
            });
        } else if (serializedKey === 'finances') {
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
