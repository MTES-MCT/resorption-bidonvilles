import { Document, Packer, convertInchesToTwip } from 'docx';
import { AuthUser } from '#server/middlewares/authMiddleware';
import { Shantytown } from '#root/types/resources/Shantytown.d';
import departementsInResorptionPhases from './_common/departements_in_resorption_phases';
import logos from './export/section_logos';
import context from './export/1_section_context';
import people from './export/section_people';
import livingConditions from './export/2_section_living_conditions';
import actors from './export/option_section_actors';
import actions from './export/option_section_actions';
import justiceProcedure from './export/option_justice_procedure';
import comments from './export/option_section_comments';
import changelog from './export/option_section_changelog';
import resorptionPhases from './export/option_section_resorption_phases';

const buildShantytownExport = (user: AuthUser, shantytown: Shantytown, options) => {
    const uniformMargin = convertInchesToTwip(1.75 / 2.54);
    const pageMargins = {
        top: uniformMargin,
        right: uniformMargin,
        bottom: uniformMargin,
        left: uniformMargin,
    };

    const sections = [
        logos(),
        context(user, shantytown),
        people(shantytown),
        livingConditions(shantytown),
    ];

    if (options.includes('actors')) {
        sections.push(actors(shantytown));
    }
    if (options.includes('actions')) {
        sections.push(actions(shantytown));
    }
    if (options.includes('justice')) {
        sections.push(justiceProcedure(shantytown));
    }
    if (options.includes('comments')) {
        sections.push(comments(shantytown));
    }
    if (options.includes('history')) {
        sections.push(changelog(shantytown));
    }
    // Phases de résorption : uniquement pour les départements concernés
    // et si l'utilisateur a la permission ou est admin national
    if (options.includes('resorption_phases')) {
        const isInExperimentDepartement = departementsInResorptionPhases.includes(
            Number.parseInt(shantytown.departement.code, 10),
        );
        const hasPermission = user.is_superuser || user.isAllowedTo('export', 'shantytown_resorption');

        if (isInExperimentDepartement && hasPermission) {
            sections.push(resorptionPhases(shantytown));
        }
    }

    const doc = new Document({
        sections: sections.map(section => ({
            ...section,
            properties: {
                ...section.properties,
                page: {
                    ...section.properties?.page,
                    margin: pageMargins,
                },
            },
        })),
    });

    return Packer.toBuffer(doc);
};

export default buildShantytownExport;
