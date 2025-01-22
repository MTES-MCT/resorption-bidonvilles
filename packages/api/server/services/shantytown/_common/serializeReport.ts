import toiletTypes from '#server/models/shantytownToiletTypesModel/_common/toiletTypes';
import electricityAccessTypes from '#server/models/electricityAccessTypesModel/_common/electricityAccessTypes';
import waterAccessTypes from '#server/models/_common/waterAccessTypes';

const census_statuses = {
    done: 'Réalisé',
    scheduled: 'Prévu',
    none: 'Non Prévu',
};

const police_statuses = {
    none: 'Non demandé',
    requested: 'Demandé',
    granted: 'Obtenu',
};

function boolToStr(bool: boolean, ifTrue: string = 'Oui', ifFalse:string = 'Non'): string {
    if (bool === undefined) {
        return undefined;
    }

    if (bool === true) {
        return ifTrue;
    }

    if (bool === false) {
        return ifFalse;
    }

    return 'Inconnu';
}

export type TownInput = {
    address: string,
    latitude: number,
    longitude: number,
    name?: string,
    built_at?: Date,
    declared_at: Date,
    field_type_full: {
        label: string,
    },
    detailed_address?: string,
    owner_type_full: {
        label: string,
    },
    owner?: string,
    population_total?: number,
    population_total_females?: number,
    population_couples?: number,
    population_minors?: number,
    population_minors_girls?: number,
    population_minors_0_3?: number,
    population_minors_3_6?: number,
    population_minors_6_12?: number,
    population_minors_12_16?: number,
    population_minors_16_18?: number,
    minors_in_school?: number,
    caravans?: number,
    huts?: number,
    tents?: number,
    cars?: number,
    mattresses?: number,
    census_conducted_by?: string,
    is_reinstallation?: boolean,
    reinstallation_comments?: string,
    social_origins_full: { label: string }[],
    census_status: string,
    census_conducted_at?: Date,
    reinstallation_incoming_towns_full: { id: number, address: string }[],
    water_access_type: string,
    water_access_type_details?: string,
    water_access_is_public?: boolean,
    water_access_is_continuous?: boolean,
    water_access_is_continuous_details?: string,
    water_access_is_local?: boolean,
    water_access_is_close?: boolean,
    water_access_is_unequal?: boolean,
    water_access_is_unequal_details?: string,
    water_access_has_stagnant_water?: boolean,
    water_access_comments?: string,
    sanitary_working_toilets?: boolean,
    sanitary_open_air_defecation?: boolean,
    sanitary_toilet_types?: string[],
    sanitary_toilets_are_inside?: boolean,
    sanitary_toilets_are_lighted?: boolean,
    sanitary_hand_washing?: boolean,
    electricity_access?: boolean,
    electricity_access_types?: string[],
    electricity_access_is_unequal?: boolean,
    trash_is_piling?: boolean,
    trash_evacuation_is_close?: boolean,
    trash_evacuation_is_safe?: boolean,
    trash_evacuation_is_regular?: boolean,
    trash_bulky_is_piling?: boolean,
    pest_animals_presence?: boolean,
    pest_animals_details?: string,
    fire_prevention_diagnostic?: boolean,
    owner_complaint?: boolean,
    justice_procedure?: boolean,
    justice_rendered?: boolean,
    justice_rendered_at?: Date,
    justice_rendered_by?: string,
    justice_challenged?: boolean,
    police_status: string,
    police_requested_at?: Date,
    police_granted_at?: Date,
    bailiff?: string,
};

export default async (town: TownInput) => [
    {
        title: 'Adresse et Caractéristiques',
        fields: [
            { label: 'Adresse', value: town.address },
            { label: 'Latitude', value: town.latitude },
            { label: 'Longitude', value: town.longitude },
            { label: 'Appellation du site', value: town.name },
            { label: 'Date d\'installation', value: town.built_at?.toLocaleDateString('fr') },
            { label: 'Date de signalement', value: town.declared_at?.toLocaleDateString('fr') },
            { label: 'Type de site', value: town.field_type_full.label },
            { label: 'Informations d\'accès', value: town.detailed_address },
            { label: 'Quel est le propriétaire ?', value: town.owner_type_full.label },
            { label: 'Nom du propriétaire', value: town.owner },
        ],
    },
    {
        title: 'Habitants',
        fields: [
            { label: 'Personnes', value: town.population_total },
            { label: 'dont femmes et filles', value: town.population_total_females },
            { label: 'Ménages', value: town.population_couples },
            { label: 'Mineurs', value: town.population_minors },
            { label: 'dont filles', value: town.population_minors_girls },
            { label: '0-3 ans', value: town.population_minors_0_3 },
            { label: '3-6 ans', value: town.population_minors_3_6 },
            { label: '6-12 ans', value: town.population_minors_6_12 },
            { label: '12-16', value: town.population_minors_12_16 },
            { label: '16-18', value: town.population_minors_16_18 },
            { label: 'Inscrits en établissement scolaire', value: town.minors_in_school },
            { label: 'Quelle est l\'origine des habitants ?', value: town.social_origins_full.map(social_origin => social_origin.label).join(', ') },
            { label: 'Caravanes', value: town.caravans },
            { label: 'Habitats autoconstruits', value: town.huts },
            { label: 'Tentes', value: town.tents },
            { label: 'Voitures dortoir', value: town.cars },
            { label: 'Matelas', value: town.mattresses },
            { label: 'Quel est le statut du diagnostic social', value: census_statuses[town.census_status] || 'Inconnu' },
            { label: 'Date du diagnostic', value: town.census_conducted_at?.toLocaleDateString('fr') },
            { label: 'Intervenant en charge du diagnostic', value: town.census_conducted_by },
            { label: 'Tout ou partie des habitants viennent-ils d\'un ou plusieurs sites du territoire ', value: boolToStr(town.is_reinstallation) },
            { label: 'Précisions sur la réinstallation', value: town.reinstallation_comments },
            { label: 'Sites d\'origine des habitants', value: town.reinstallation_incoming_towns_full.map(incoming_town => `id: ${incoming_town.id} — ${incoming_town.address}`).join(' / ') },
        ],
    },
    {
        title: 'Conditions de vie et environnement',
        fields: [
            { label: 'Comment les habitants ont-ils accès à l\'eau ? ', value: waterAccessTypes[town.water_access_type] },
            { label: 'Veuillez préciser les modalités d\'accès à l\'eau', value: town.water_access_type_details },
            { label: 'Est-ce un point d\'eau sur la voie publique ?', value: boolToStr(town.water_access_is_public) },
            { label: 'L\'accès est-il continu ?', value: boolToStr(town.water_access_is_continuous) },
            { label: 'Précisions sur l\'accès continu', value: town.water_access_is_continuous_details },
            { label: 'Où se situe l\'accès ?', value: boolToStr(town.water_access_is_local, 'Sur site', 'A l\'extérieur du site') },
            { label: 'Quelle est la distance entre le point d\'eau et l\'habitation la plus éloignée ?', value: boolToStr(town.water_access_is_close, 'Moins de 200m', 'Plus de 200m') },
            { label: 'Des inégalités d\'accès ont-elles été constatées ?', value: boolToStr(town.water_access_is_unequal) },
            { label: 'Précisions sur les inégalités d\'accès', value: town.water_access_is_unequal_details },
            { label: 'Existe-t-il des eaux stagnantes autour du point de distribution ?', value: boolToStr(town.water_access_has_stagnant_water) },
            { label: 'Information complémentaires sur l\'accès à l\'eau', value: town.water_access_comments },
            { label: 'Les habitants ont-ils accès à des toilettes fonctionnelles ? ', value: boolToStr(town.sanitary_working_toilets) },
            { label: 'Constate-t-on des marques de défécation à l’air libre ?', value: boolToStr(town.sanitary_open_air_defecation) },
            { label: 'Quels sont les types de toilettes installées ?', value: town.sanitary_toilet_types.map(type => toiletTypes[type]).join(', ') },
            { label: 'Les toilettes sont-elles à l’intérieur du site ?', value: boolToStr(town.sanitary_toilets_are_inside) },
            { label: 'Ces toilettes sont-elles éclairées et verrouillables de l’intérieur ?', value: boolToStr(town.sanitary_toilets_are_lighted) },
            { label: 'Y a-t-il un point de lavage des mains à proximité des toilettes ?', value: boolToStr(town.sanitary_hand_washing) },
            { label: 'Les habitants ont-ils accès à l\'électricité ?', value: boolToStr(town.electricity_access) },
            { label: 'Quelle est la source de l\'accès à l\'électricité ?', value: town.electricity_access_types.map(type => electricityAccessTypes[type]).join(', ') },
            { label: 'Des inégalités d’accès à l\'électricité ont-elles été constatées ?', value: boolToStr(town.electricity_access_is_unequal) },
            { label: 'Constate-t-on une accumulation de déchets type ordures ménagères sur le site ou aux abords ?', value: boolToStr(town.trash_is_piling) },
            { label: 'Y a-t-il des dispositifs de ramassage des ordures ménagères (poubelles, bacs, bennes...) à proximité immédiate du site (moins de 100m) ?', value: boolToStr(town.trash_evacuation_is_close) },
            { label: 'Les dispositifs de ramassage des ordures ménagères (poubelles, bacs, bennes...) sont-ils en bon état et sécurisés ?', value: boolToStr(town.trash_evacuation_is_safe) },
            { label: 'La collecte des poubelles / bennes est-elle réalisée de manière régulière ?', value: boolToStr(town.trash_evacuation_is_regular) },
            { label: 'Constate-t-on une accumulation de déchets type encombrants (hors ferraille) ou gravats sur le site ou aux abords ?', value: boolToStr(town.trash_bulky_is_piling) },
            { label: 'Y a-t-il des nuisibles sur le site ou à proximité ?', value: boolToStr(town.pest_animals_presence) },
            { label: 'Informations complémentaires sur la présence de nuisibles', value: town.pest_animals_details },
            { label: 'Un diagnostic prévention incendie a-t-il été réalisé par le SDIS (Service départemental d\'incendie et de secours) ?', value: boolToStr(town.fire_prevention_diagnostic) },
        ],
    },
    {
        title: 'Procédures judiciaires',
        fields: [
            { label: 'Une plainte a-t-elle été déposée par le propriétaire ?', value: boolToStr(town.owner_complaint) },
            { label: 'Une procédure judiciaire est-elle en cours ?', value: boolToStr(town.justice_procedure) },
            { label: 'Décision de justice rendue', value: boolToStr(town.justice_rendered) },
            { label: 'Date de la décision', value: town.justice_rendered_at?.toLocaleDateString('fr') },
            { label: 'Origine de la décision', value: town.justice_rendered_by },
            { label: 'Existence d\'un contentieux', value: boolToStr(town.justice_challenged) },
            { label: 'Statut du concours de la force publique', value: police_statuses[town.police_status] || 'Inconnu' },
            { label: 'Date de la demande du CFP', value: town.police_requested_at?.toLocaleDateString('fr') },
            { label: 'Date d\'octroi du CFP', value: town.police_granted_at?.toLocaleDateString('fr') },
            { label: 'Nom de l\'étude d\'huissier ', value: town.bailiff },

        ],
    },
];
