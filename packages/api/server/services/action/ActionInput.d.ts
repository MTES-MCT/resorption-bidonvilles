import { Departement } from '#server/models/geoModel/Location.d';
import ActionLocationType from '#root/types/resources/ActionLocationType.d';

type ActionInputUser = {
    id: number,
    organization_id: number
};

type ActionFinanceType = 'etatique' | 'dedie' | 'collectivite' | 'europeen' | 'prive' | 'autre';
type ActionFinances = {
    [key: number]: ActionFinanceRow[]
};
type ActionFinanceRow = {
    finance_type: ActionFinanceType,
    comments: string,
    amount: number,
    real_amount: number,
};

export interface ActionInput {
    name: string,
    started_at: Date,
    ended_at: Date | null,
    topics: string[],
    goals: string,
    finances?: ActionFinances,
    location: Departement,
    location_departement: string,
    location_type: ActionLocationType,
    location_eti: string | null,
    location_eti_citycode: string | null,
    latitude: number | null,
    longitude: number | null,
    location_shantytowns: number[] | null,
    location_autre: string | null,
    managers: ActionInputUser[],
    operators: ActionInputUser[],
    indicateurs: {
        [key: string]: {
            nombre_personnes: number | null,
            nombre_menages: number | null,
            nombre_femmes: number | null,
            nombre_mineurs: number | null,
            sante_nombre_personnes: number | null,
            travail_nombre_personnes: number | null,
            travail_nombre_femmes: number | null,
            hebergement_nombre_personnes: number | null,
            hebergement_nombre_menages: number | null,
            logement_nombre_personnes: number | null,
            logement_nombre_menages: number | null,
            scolaire_mineurs_trois_ans_et_plus: number | null,
            scolaire_mineurs_en_mediation: number | null,
            scolaire_nombre_maternelle: number | null,
            scolaire_nombre_elementaire: number | null,
            scolaire_nombre_college: number | null,
            scolaire_nombre_lycee: number | null,
            scolaire_nombre_autre: number | null,
        }
    },
}

export interface ActionEnrichedInput extends ActionInput {
    address: string | null
}

export interface ActionCreateInput extends ActionEnrichedInput {
    created_by: number
}

export interface ActionUpdateInput extends ActionEnrichedInput {
    updated_by: number
}
