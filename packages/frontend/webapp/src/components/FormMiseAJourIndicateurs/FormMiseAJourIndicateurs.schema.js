import { object, string, date, number, array } from "yup";
import labels from "./FormMiseAJourIndicateurs.labels.js";

export default function (topics) {
    const schema = {};
    schema.date = date()
        .typeError(`${labels.date} est obligatoire`)
        .required()
        .max(new Date())
        .label(labels.date);

    // audience
    schema.audience = object().shape({
        in: object().shape({
            total: number().min(0).nullable(),
            families: number().min(0).nullable(),
            women: number().min(0).nullable(),
            minors: number().min(0).nullable(),
        }),
        out_positive: object().shape({
            total: number().min(0).nullable(),
            families: number().min(0).nullable(),
            women: number().min(0).nullable(),
            minors: number().min(0).nullable(),
        }),
        out_abandoned: object().shape({
            total: number().min(0).nullable(),
            families: number().min(0).nullable(),
            women: number().min(0).nullable(),
            minors: number().min(0).nullable(),
        }),
        out_excluded: object().shape({
            total: number().min(0).nullable(),
            families: number().min(0).nullable(),
            women: number().min(0).nullable(),
            minors: number().min(0).nullable(),
        }),
    });

    // team;
    schema.etp = array().of(
        object().shape({
            total: number().min(0).nullable(),
            type: string(),
        })
    );

    // indicateurs droit commun
    schema.domiciliation = number().min(0).nullable();
    schema.droits_caf = number().min(0).nullable();
    schema.emploi_stable = number().min(0).nullable();

    // indicateurs santé
    if (topics.includes("health")) {
        schema.ame_valide = number().min(0).nullable().label(labels.ame_valide);
        schema.puma_valide = number()
            .min(0)
            .nullable()
            .label(labels.puma_valide);
        schema.ame_en_cours = number()
            .min(0)
            .nullable()
            .label(labels.ame_en_cours);
        schema.puma_en_cours = number()
            .min(0)
            .nullable()
            .label(labels.puma_en_cours);
        schema.orientation = number()
            .min(0)
            .nullable()
            .label(labels.orientation);
        schema.accompagnement = number()
            .min(0)
            .nullable()
            .label(labels.accompagnement);
    }

    // indicateurs logement
    if (topics.includes("housing")) {
        schema.siao = object().shape({
            families: number().min(0).nullable().label(labels.siao.families),
            people: number().min(0).nullable().label(labels.siao.people),
        });
        schema.logement_social = object().shape({
            families: number()
                .min(0)
                .nullable()
                .label(labels.logement_social.families),
            people: number()
                .min(0)
                .nullable()
                .label(labels.logement_social.people),
        });
        schema.dalo = object().shape({
            families: number().min(0).nullable().label(labels.dalo.families),
            people: number().min(0).nullable().label(labels.dalo.people),
        });
        schema.accompagnes = object().shape({
            families: number()
                .min(0)
                .nullable()
                .label(labels.accompagnes.families),
            people: number().min(0).nullable().label(labels.accompagnes.people),
        });
        schema.non_accompagnes = object().shape({
            families: number()
                .min(0)
                .nullable()
                .label(labels.non_accompagnes.families),
            people: number()
                .min(0)
                .nullable()
                .label(labels.non_accompagnes.people),
        });
        schema.heberges = object().shape({
            families: number()
                .min(0)
                .nullable()
                .label(labels.heberges.families),
            people: number().min(0).nullable().label(labels.heberges.people),
        });
    }

    // indicateurs sécurisation
    if (topics.includes("safety")) {
        schema.points_eau = number().min(0).nullable().label(labels.points_eau);
        schema.wc = number().min(0).nullable().label(labels.wc);
        schema.nombre_bennes = number()
            .min(0)
            .nullable()
            .label(labels.nombre_bennes);
        schema.electricite = number()
            .min(0)
            .nullable()
            .label(labels.electricite);
    }

    // indicateurs éducation
    if (topics.includes("school")) {
        schema.scolarisables = number()
            .min(0)
            .nullable()
            .label(labels.scolarisables);
        schema.en_mediation = number()
            .min(0)
            .nullable()
            .label(labels.en_mediation);
        schema.maternelles = number()
            .min(0)
            .nullable()
            .label(labels.maternelles);
        schema.elementaires = number()
            .min(0)
            .nullable()
            .label(labels.elementaires);
        schema.colleges = number().min(0).nullable().label(labels.colleges);
        schema.lycees = number().min(0).nullable().label(labels.lycees);
        schema.difficultes = array();
    }

    // indicateurs formation
    if (topics.includes("work")) {
        schema.pole_emploi = number().min(0).nullable();
        schema.pole_emploi_femmes = number().min(0).nullable();
        schema.mission_locale = number().min(0).nullable();
        schema.mission_locale_femmes = number().min(0).nullable();
        schema.contrats = number().min(0).nullable();
        schema.contrats_femmes = number().min(0).nullable();
        schema.formations = number().min(0).nullable();
        schema.formations_femmes = number().min(0).nullable();
        schema.autoentrepreneurs = number().min(0).nullable();
        schema.autoentrepreneurs_femmes = number().min(0).nullable();
        schema.are = number().min(0).nullable();
        schema.are_femmes = number().min(0).nullable();
    }

    return object(schema);
}
