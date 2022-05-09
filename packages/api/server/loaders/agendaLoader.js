const Agenda = require('agenda');
const { agenda } = require('#server/config');

let instance = null;

module.exports = {
    getAgenda() {
        if (instance === null) {
            instance = new Agenda({
                db: {
                    address: agenda.mongo_address,
                    options: { useUnifiedTopology: true },
                },
                processEvery: '40 seconds',
            });
        }

        return instance;
    },
};
