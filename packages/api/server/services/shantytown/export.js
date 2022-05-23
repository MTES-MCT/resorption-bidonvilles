const { Document, Packer } = require('docx');
const logos = require('./export/section_logos');
const context = require('./export/1_section_context');
const people = require('./export/section_people');
const lifeConditions = require('./export/2_section_life_conditions');
const actors = require('./export/option_section_actors');
const plans = require('./export/option_section_plans');
const justiceProcedure = require('./export/option_justice_procedure');
const comments = require('./export/option_section_comments');
const changelog = require('./export/option_section_changelog');

module.exports = (user, shantytown, options) => {
    const sections = [
        logos(),
        context(user, shantytown),
        people(shantytown),
        lifeConditions(shantytown),
    ];

    if (options.includes('actors')) {
        sections.push(actors(shantytown));
    }
    if (options.includes('actions')) {
        sections.push(plans(shantytown));
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
