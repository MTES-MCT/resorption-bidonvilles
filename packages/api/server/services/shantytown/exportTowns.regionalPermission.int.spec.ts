import chai from 'chai';
import { QueryTypes } from 'sequelize';
import { sequelize } from '#db/sequelize';
import { serialized as fakeUser } from '#test/utils/user';
import { Region } from '#server/models/geoModel/Location.d';
import exportTowns from './exportTowns';

const { expect } = chai;

/**
 * Test de régression pour le bug remonté par Sentry sur l'export de sites :
 *   "missing FROM-clause entry for table \"regions\""
 *
 * Un utilisateur disposant d'une permission d'export de niveau RÉGIONAL (pas national,
 * pas départemental) obtenait cette erreur Postgres dès que l'export tentait de
 * déterminer les actions financées de chaque site (exportTowns.fetchCurrentData ->
 * actionModel.fetchFinancedActionsByYear), car cette requête ne joignait jamais la
 * table `regions` alors que la clause de permission régionale la référençait.
 *
 * Test d'intégration (vraie base Postgres, aucun mock de fetchData/generateExportFile) :
 * seule façon de détecter une erreur SQL réelle. server/services/shantytown/exportTowns.spec.ts
 * (test unitaire existant) mocke fetchData et ne peut donc pas la détecter.
 */
describe('services/shantytown.exportTowns() [int] - permission régionale', () => {
    let region: Region;

    before(async function beforeAllHook() {
        this.timeout(20000);

        const [row] = await sequelize.query<{ code: string, name: string }>(
            `SELECT regions.code, regions.name
             FROM shantytowns
             JOIN cities ON shantytowns.fk_city = cities.code
             JOIN departements ON cities.fk_departement = departements.code
             JOIN regions ON departements.fk_region = regions.code
             WHERE shantytowns.closed_at IS NULL
             GROUP BY regions.code, regions.name
             ORDER BY COUNT(shantytowns.shantytown_id) DESC
             LIMIT 1`,
            { type: QueryTypes.SELECT },
        );

        if (!row) {
            throw new Error('Aucun site ouvert trouvé en base de test : impossible de construire ce test (vérifier les seeders, yarn db:create).');
        }

        region = {
            type: 'region',
            region: { code: row.code, name: row.name },
            departement: null,
            epci: null,
            city: null,
        };
    });

    it(' n\'échoue pas et retourne un export Excel valide pour un utilisateur à permission d\'export RÉGIONALE', async () => {
        const user = fakeUser({
            permissions: {
                shantytown: {
                    export: {
                        allowed: true,
                        allowed_on_national: false,
                        allowed_on: {
                            regions: [region],
                            departements: [],
                            epci: [],
                            cities: [],
                            actions: [],
                        },
                    },
                },
                action: {
                    read: {
                        allowed: true,
                        allowed_on_national: false,
                        allowed_on: {
                            regions: [region],
                            departements: [],
                            epci: [],
                            cities: [],
                            actions: [],
                        },
                    },
                },
            },
        });

        // Reproduit fidèlement le flux frontend : la modale d'export envoie
        // locationType=nation par défaut (aucun territoire explicitement sélectionné),
        // et c'est getAllowedLocations qui restreint alors l'export au périmètre régional
        // autorisé de l'utilisateur (cf. server/utils/permission/restrict.ts).
        //
        // Avant le correctif de fetchFinancedActionsByYear, cet appel levait :
        // "missing FROM-clause entry for table \"regions\""
        const buffer = await exportTowns(
            user,
            {
                type: 'nation', region: null, departement: null, epci: null, city: null,
            },
            { exportedSitesStatus: 'open' },
            [],
            new Date(),
        );

        expect(buffer).to.be.instanceOf(Buffer);
        expect(buffer.byteLength).to.be.greaterThan(0);
    });
});
