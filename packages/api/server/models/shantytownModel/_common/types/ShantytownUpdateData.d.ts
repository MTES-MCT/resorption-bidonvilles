/**
 * Type pour les données de mise à jour d'un shantytown
 * Tous les champs sont optionnels car on peut mettre à jour seulement certains champs
 */
export interface ShantytownUpdateData {
    // Informations de base
    name?: string;
    status?: 'open' | 'unknown' | 'closed_by_justice' | 'closed_by_city_admin' | 'closed_by_pref_admin' | 'resorbed' | 'other';
    closing_context?: string | null;
    latitude?: number;
    longitude?: number;
    address?: string;
    address_details?: string;
    fk_city?: string;
    built_at?: Date | null;
    declared_at?: Date | null;
    closed_at?: Date | null;
    fk_field_type?: number;
    is_reinstallation?: boolean;
    reinstallation_comments?: string | null;

    // Recensement
    census_status?: string | null;
    census_conducted_at?: Date | null;
    census_conducted_by?: string | null;

    // Population
    population_total?: number | null;
    population_total_females?: number | null;
    population_couples?: number | null;
    population_minors?: number | null;
    population_minors_girls?: number | null;
    population_minors_0_3?: number | null;
    population_minors_3_6?: number | null;
    population_minors_6_12?: number | null;
    population_minors_12_16?: number | null;
    population_minors_16_18?: number | null;
    minors_in_school?: number | null;
    population_updated_at?: Date | null;

    // Logements
    caravans?: number | null;
    huts?: number | null;
    tents?: number | null;
    cars?: number | null;
    mattresses?: number | null;

    // Conditions de vie
    living_conditions_version?: number;
    fk_electricity_type?: number | null;
    electricity_comments?: string | null;
    access_to_water?: boolean | null;
    water_comments?: string | null;
    water_potable?: boolean | null;
    water_continuous_access?: boolean | null;
    water_public_point?: boolean | null;
    water_distance?: string | null;
    water_roads_to_cross?: number | null;
    water_everyone_has_access?: boolean | null;
    water_stagnant_water?: boolean | null;
    water_hand_wash_access?: boolean | null;
    water_hand_wash_access_number?: number | null;
    trash_evacuation?: boolean | null;
    trash_cans_on_site?: boolean | null;
    trash_accumulation?: boolean | null;
    trash_evacuation_regular?: boolean | null;
    vermin?: boolean | null;
    vermin_comments?: string | null;
    fire_prevention_measures?: boolean | null;
    fire_prevention_diagnostic?: boolean | null;
    fire_prevention_site_accessible?: boolean | null;
    fire_prevention_devices?: boolean | null;
    fire_prevention_comments?: string | null;
    access_to_sanitary?: boolean | null;
    sanitary_comments?: string | null;
    sanitary_number?: number | null;
    sanitary_insalubrious?: boolean | null;
    sanitary_on_site?: boolean | null;

    // Conditions de vie v2
    water_access_type?: string | null;
    water_access_type_details?: string | null;
    water_access_is_public?: boolean | null;
    water_access_is_continuous?: boolean | null;
    water_access_is_continuous_details?: string | null;
    water_access_is_local?: boolean | null;
    water_access_is_close?: boolean | null;
    water_access_is_unequal?: boolean | null;
    water_access_is_unequal_details?: string | null;
    water_access_has_stagnant_water?: boolean | null;
    water_access_comments?: string | null;
    sanitary_access_open_air_defecation?: boolean | null;
    sanitary_access_working_toilets?: number | null;
    sanitary_access_toilets_are_inside?: boolean | null;
    sanitary_access_toilets_are_lighted?: boolean | null;
    sanitary_access_hand_washing?: boolean | null;
    electricity_access?: boolean | null;
    electricity_access_is_unequal?: boolean | null;
    trash_is_piling?: boolean | null;
    trash_evacuation_is_close?: boolean | null;
    trash_evacuation_is_safe?: boolean | null;
    trash_evacuation_is_regular?: boolean | null;
    trash_bulky_is_piling?: boolean | null;
    pest_animals?: boolean | null;
    pest_animals_details?: string | null;
    fire_prevention?: boolean | null;

    // Justice (nécessite permission shantytown_justice)
    owner_complaint?: boolean | null;
    justice_procedure?: boolean | null;
    justice_rendered?: boolean | null;
    justice_rendered_at?: Date | null;
    justice_rendered_by?: string | null;
    justice_challenged?: boolean | null;
    police_status?: string | null;
    police_requested_at?: Date | null;
    police_granted_at?: Date | null;
    bailiff?: string | null;
    existing_litigation?: boolean | null;
    evacuation_under_time_limit?: boolean | null;
    administrative_order_decision_at?: Date | null;
    administrative_order_decision_rendered_by?: string | null;
    administrative_order_evacuation_at?: Date | null;
    insalubrity_order?: boolean | null;
    insalubrity_order_displayed?: boolean | null;
    insalubrity_order_type?: string | null;
    insalubrity_order_by?: string | null;
    insalubrity_order_at?: Date | null;
    insalubrity_parcels?: string | null;
    attachments?: any[];

    // Propriétaire (nécessite permission shantytown_owner)
    owner?: string | null;

    // Fermeture
    closed_with_solutions?: boolean | null;
    resorption_target?: number | null;

    // Relations (tableaux)
    social_origins?: number[];
    closing_solutions?: Array<{
        id: number;
        people_affected?: number | null;
        households_affected?: number | null;
        message?: string | null;
    }>;
    sanitary_toilet_types?: string[];
    electricity_access_types?: string[];
    reinstallation_incoming_towns?: number[];
    preparatory_phases?: string[];

    // Métadonnées
    updated_at?: Date;
    updated_by?: number;
}
