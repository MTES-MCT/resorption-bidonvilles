import { Document, Packer } from 'docx';
import { SerializedUser } from '#server/models/userModel/_common/types/SerializedUser.d';
import { Shantytown } from '#server/models/shantytownModel/_common/serializeShantytown';
import logos from './export/section_logos';
import context from './export/1_section_context';
import people from './export/section_people';
import livingConditions from './export/2_section_living_conditions';
import actors from './export/option_section_actors';
import actions from './export/option_section_actions';
import justiceProcedure from './export/option_justice_procedure';
import comments from './export/option_section_comments';
import changelog from './export/option_section_changelog';

export default (user: SerializedUser, shantytown: Shantytown, options) => {
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

    const doc = new Document({
        sections,
    });

    return Packer.toBuffer(doc);
};
