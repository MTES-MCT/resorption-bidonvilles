const Agenda = require('agenda');
const { agenda } = require('#server/config');

let instance = null;

module.exports = () => {
    if (instance === null) {
        instance = new Agenda({
            db: {
                address: agenda.mongo_address,
            },
        });
    }

    return instance;
};
