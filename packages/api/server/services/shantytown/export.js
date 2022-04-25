const { Document, Packer } = require('docx');
const context = require('./export/1_section_context');
const lifeConditions = require('./export/2_section_life_conditions');

module.exports = (user, shantytown) => {
    const doc = new Document({
        sections: [
            context(user, shantytown),
            lifeConditions(shantytown),
        ],
    });

    return Packer.toBuffer(doc);
};
