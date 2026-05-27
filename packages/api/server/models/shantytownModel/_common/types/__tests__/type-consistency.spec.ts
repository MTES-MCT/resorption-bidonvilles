/**
 * Tests de cohérence entre ShantytownUpdateData (snake_case, DB-oriented)
 * et Shantytown (camelCase, API-oriented)
 *
 * Ces tests vérifient que les types correspondent correctement entre :
 * - Les données de mise à jour (payload entrant)
 * - Les données sérialisées (réponse API)
 */

import { expect } from 'chai';
import { ShantytownUpdateData } from '../ShantytownUpdateData.d';
import { Shantytown } from '#root/types/resources/Shantytown.d';

describe('Type consistency: ShantytownUpdateData ↔ Shantytown', () => {
    /**
     * Mapping explicite entre les champs snake_case (DB) et camelCase (API)
     * Ce mapping sert de documentation et de référence pour les conversions
     */
    const FIELD_MAPPING: Record<keyof ShantytownUpdateData, string> = {
        // Informations de base
        name: 'name',
        status: 'status',
        closing_context: 'closingContext',
        latitude: 'latitude',
        longitude: 'longitude',
        address: 'address',
        address_details: 'addressDetails',
        fk_city: 'city.code',
        built_at: 'builtAt',
        declared_at: 'declaredAt',
        closed_at: 'closedAt',
        fk_field_type: 'fieldType.id',
        is_reinstallation: 'isReinstallation',
        reinstallation_comments: 'reinstallationComments',

        // Recensement
        census_status: 'censusStatus',
        census_conducted_at: 'censusConductedAt',
        census_conducted_by: 'censusConductedBy',

        // Population
        population_total: 'populationTotal',
        population_total_females: 'populationTotalFemales',
        population_couples: 'populationCouples',
        population_minors: 'populationMinors',
        population_minors_girls: 'populationMinorsGirls',
        population_minors_0_3: 'populationMinors0To3',
        population_minors_3_6: 'populationMinors3To6',
        population_minors_6_12: 'populationMinors6To12',
        population_minors_12_16: 'populationMinors12To16',
        population_minors_16_18: 'populationMinors16To18',
        minors_in_school: 'minorsInSchool',
        population_updated_at: 'populationUpdatedAt',

        // Logements
        caravans: 'caravans',
        huts: 'huts',
        tents: 'tents',
        cars: 'cars',
        mattresses: 'mattresses',

        // Conditions de vie
        living_conditions_version: 'livingConditions.version',
        fk_electricity_type: 'livingConditions.electricityType',
        electricity_comments: 'livingConditions.electricityComments',
        access_to_water: 'livingConditions.accessToWater',
        water_comments: 'livingConditions.waterComments',
        water_potable: 'livingConditions.waterPotable',
        water_continuous_access: 'livingConditions.waterContinuousAccess',
        water_public_point: 'livingConditions.waterPublicPoint',
        water_distance: 'livingConditions.waterDistance',
        water_roads_to_cross: 'livingConditions.waterRoadsToCross',
        water_everyone_has_access: 'livingConditions.waterEveryoneHasAccess',
        water_stagnant_water: 'livingConditions.waterStagnantWater',
        water_hand_wash_access: 'livingConditions.waterHandWashAccess',
        water_hand_wash_access_number: 'livingConditions.waterHandWashAccessNumber',
        trash_evacuation: 'livingConditions.trashEvacuation',
        trash_cans_on_site: 'livingConditions.trashCansOnSite',
        trash_accumulation: 'livingConditions.trashAccumulation',
        trash_evacuation_regular: 'livingConditions.trashEvacuationRegular',
        vermin: 'livingConditions.vermin',
        vermin_comments: 'livingConditions.verminComments',
        fire_prevention_measures: 'livingConditions.firePreventionMeasures',
        fire_prevention_diagnostic: 'livingConditions.firePreventionDiagnostic',
        fire_prevention_site_accessible: 'livingConditions.firePreventionSiteAccessible',
        fire_prevention_devices: 'livingConditions.firePreventionDevices',
        fire_prevention_comments: 'livingConditions.firePreventionComments',
        access_to_sanitary: 'livingConditions.accessToSanitary',
        sanitary_comments: 'livingConditions.sanitaryComments',
        sanitary_number: 'livingConditions.sanitaryNumber',
        sanitary_insalubrious: 'livingConditions.sanitaryInsalubrious',
        sanitary_on_site: 'livingConditions.sanitaryOnSite',

        // Conditions de vie v2
        water_access_type: 'livingConditions.waterAccessType',
        water_access_type_details: 'livingConditions.waterAccessTypeDetails',
        water_access_is_public: 'livingConditions.waterAccessIsPublic',
        water_access_is_continuous: 'livingConditions.waterAccessIsContinuous',
        water_access_is_continuous_details: 'livingConditions.waterAccessIsContinuousDetails',
        water_access_is_local: 'livingConditions.waterAccessIsLocal',
        water_access_is_close: 'livingConditions.waterAccessIsClose',
        water_access_is_unequal: 'livingConditions.waterAccessIsUnequal',
        water_access_is_unequal_details: 'livingConditions.waterAccessIsUnequalDetails',
        water_access_has_stagnant_water: 'livingConditions.waterAccessHasStagnantWater',
        water_access_comments: 'livingConditions.waterAccessComments',
        sanitary_access_open_air_defecation: 'livingConditions.sanitaryAccessOpenAirDefecation',
        sanitary_access_working_toilets: 'livingConditions.sanitaryAccessWorkingToilets',
        sanitary_access_toilets_are_inside: 'livingConditions.sanitaryAccessToiletsAreInside',
        sanitary_access_toilets_are_lighted: 'livingConditions.sanitaryAccessToiletsAreLighted',
        sanitary_access_hand_washing: 'livingConditions.sanitaryAccessHandWashing',
        electricity_access: 'livingConditions.electricityAccess',
        electricity_access_is_unequal: 'livingConditions.electricityAccessIsUnequal',
        trash_is_piling: 'livingConditions.trashIsPiling',
        trash_evacuation_is_close: 'livingConditions.trashEvacuationIsClose',
        trash_evacuation_is_safe: 'livingConditions.trashEvacuationIsSafe',
        trash_evacuation_is_regular: 'livingConditions.trashEvacuationIsRegular',
        trash_bulky_is_piling: 'livingConditions.trashBulkyIsPiling',
        pest_animals: 'livingConditions.pestAnimals',
        pest_animals_details: 'livingConditions.pestAnimalsDetails',
        fire_prevention: 'livingConditions.firePrevention',

        // Justice (nécessite permission shantytown_justice)
        owner_complaint: 'ownerComplaint',
        justice_procedure: 'justiceProcedure',
        justice_rendered: 'justiceRendered',
        justice_rendered_at: 'justiceRenderedAt',
        justice_rendered_by: 'justiceRenderedBy',
        justice_challenged: 'justiceChallenged',
        police_status: 'policeStatus',
        police_requested_at: 'policeRequestedAt',
        police_granted_at: 'policeGrantedAt',
        bailiff: 'bailiff',
        existing_litigation: 'existingLitigation',
        evacuation_under_time_limit: 'evacuationUnderTimeLimit',
        administrative_order_decision_at: 'administrativeOrderDecisionAt',
        administrative_order_decision_rendered_by: 'administrativeOrderDecisionRenderedBy',
        administrative_order_evacuation_at: 'administrativeOrderEvacuationAt',
        insalubrity_order: 'insalubrityOrder',
        insalubrity_order_displayed: 'insalubrityOrderDisplayed',
        insalubrity_order_type: 'insalubrityOrderType',
        insalubrity_order_by: 'insalubrityOrderBy',
        insalubrity_order_at: 'insalubrityOrderAt',
        insalubrity_parcels: 'insalubrityParcels',
        attachments: 'attachments',

        // Propriétaire (nécessite permission shantytown_owner)
        owner: 'owners',

        // Fermeture
        closed_with_solutions: 'closedWithSolutions',
        resorption_target: 'resorptionTarget',

        // Relations (tableaux)
        social_origins: 'socialOrigins',
        closing_solutions: 'closingSolutions',
        sanitary_toilet_types: 'livingConditions.sanitaryToiletTypes',
        electricity_access_types: 'livingConditions.electricityAccessTypes',
        reinstallation_incoming_towns: 'reinstallationIncomingTowns',
        preparatory_phases: 'preparatoryPhasesTowardResorption',

        // Métadonnées
        updated_at: 'updatedAt',
        updated_by: 'updatedBy.id',
    };

    describe('Type compatibility checks', () => {
        it('resorption_target doit être de type number dans les deux types', () => {
            // Cette assertion compile = les types sont cohérents
            const updateData: ShantytownUpdateData = {
                resorption_target: 2025,
            };

            const shantytown: Partial<Shantytown> = {
                resorptionTarget: 2025,
            };

            expect(typeof updateData.resorption_target).to.equal('number');
            expect(typeof shantytown.resorptionTarget).to.equal('number');
        });

        it('les dates doivent être cohérentes (Date vs number timestamp)', () => {
            // ShantytownUpdateData utilise Date
            const updateData: ShantytownUpdateData = {
                declared_at: new Date('2025-01-01'),
                closed_at: new Date('2025-12-31'),
            };

            // Shantytown utilise number (timestamp Unix)
            const shantytown: Partial<Shantytown> = {
                declaredAt: Date.now(),
                closedAt: Date.now(),
            };

            expect(updateData.declared_at).to.be.instanceOf(Date);
            expect(typeof shantytown.declaredAt).to.equal('number');
        });

        it('les champs de population doivent être number | null dans les deux types', () => {
            const updateData: ShantytownUpdateData = {
                population_total: 50,
                population_minors: null,
            };

            const shantytown: Partial<Shantytown> = {
                populationTotal: 50,
                populationMinors: null,
            };

            expect(updateData.population_total).to.equal(50);
            expect(shantytown.populationTotal).to.equal(50);
        });
    });

    describe('Field mapping documentation', () => {
        it('le mapping doit couvrir tous les champs de ShantytownUpdateData', () => {
            const mappedFields = Object.keys(FIELD_MAPPING);
            expect(mappedFields.length).to.be.greaterThan(0);

            // Ce test documente le nombre de champs mappés
            // Si ce nombre change, c'est qu'un champ a été ajouté/supprimé
            // Note: 123 champs actuellement définis dans ShantytownUpdateData
            expect(mappedFields.length).to.equal(123);
        });

        it('le mapping doit documenter la conversion snake_case → camelCase', () => {
            expect(FIELD_MAPPING.population_total).to.equal('populationTotal');
            expect(FIELD_MAPPING.declared_at).to.equal('declaredAt');
            expect(FIELD_MAPPING.is_reinstallation).to.equal('isReinstallation');
            expect(FIELD_MAPPING.fk_city).to.equal('city.code');
        });

        it('les champs de justice doivent être correctement mappés', () => {
            expect(FIELD_MAPPING.owner_complaint).to.equal('ownerComplaint');
            expect(FIELD_MAPPING.justice_procedure).to.equal('justiceProcedure');
            expect(FIELD_MAPPING.police_status).to.equal('policeStatus');
        });

        it('les champs de conditions de vie doivent pointer vers livingConditions', () => {
            expect(FIELD_MAPPING.access_to_water).to.equal('livingConditions.accessToWater');
            expect(FIELD_MAPPING.trash_accumulation).to.equal('livingConditions.trashAccumulation');
            expect(FIELD_MAPPING.fire_prevention).to.equal('livingConditions.firePrevention');
        });
    });

    describe('Critical field consistency', () => {
        it('trash_accumulation doit exister dans les deux types (régression test)', () => {
            // Ce test vérifie qu'on ne retombe pas sur la faute de frappe trash_accumuation
            const updateData: ShantytownUpdateData = {
                trash_accumulation: true,
            };

            expect(FIELD_MAPPING.trash_accumulation).to.equal('livingConditions.trashAccumulation');
            expect(updateData.trash_accumulation).to.be.true;
        });

        it('resorption_target doit être number | null (pas string)', () => {
            const updateData: ShantytownUpdateData = {
                resorption_target: 2025,
            };

            // Le type number est correct (correspond à la DB: integer)
            expect(updateData.resorption_target).to.equal(2025);
            expect(typeof updateData.resorption_target).to.equal('number');
        });

        it('status doit exister dans le type (utilisé lors de la fermeture)', () => {
            // Ce test vérifie qu'on n'oublie pas le champ status
            // qui est essentiel pour le service close.ts
            const updateData: ShantytownUpdateData = {
                status: 'resorbed',
                closing_context: 'Relogement',
            };

            expect(FIELD_MAPPING.status).to.equal('status');
            expect(FIELD_MAPPING.closing_context).to.equal('closingContext');
            expect(updateData.status).to.equal('resorbed');
        });
    });
});
