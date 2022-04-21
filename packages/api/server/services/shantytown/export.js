const {
    Document, Paragraph, TextRun, Packer,
} = require('docx');

module.exports = () => {
    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                new Paragraph({
                    children: [
                        new TextRun('Hello world'),
                    ],
                }),
            ],
        }],
    });

    return Packer.toBuffer(doc);
};
