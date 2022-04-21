module.exports = (models) => {
    const methods = {};
    // eslint-disable-next-line global-require
    methods.list = require('./townController/list');

    // eslint-disable-next-line global-require
    methods.find = require('./townController/find');

    // eslint-disable-next-line global-require
    methods.create = require('./townController/create');

    // eslint-disable-next-line global-require
    methods.close = require('./townController/close');

    // eslint-disable-next-line global-require
    methods.deleteTown = require('./townController/deleteTown');

    // eslint-disable-next-line global-require
    methods.deleteComment = require('./townController/deleteComment');

    // eslint-disable-next-line global-require
    methods.export = require('./townController/export');

    // eslint-disable-next-line global-require
    methods.createCovidComment = require('./townController/createCovidComment');

    // eslint-disable-next-line global-require
    methods.edit = require('./townController/edit');

    // eslint-disable-next-line global-require
    methods.createHighCovidComment = require('./townController/createHighCovidComment')(
        models,
    );

    // eslint-disable-next-line global-require
    methods.addActor = require('./townController/addActor');

    // eslint-disable-next-line global-require
    methods.updateActor = require('./townController/updateActor');

    // eslint-disable-next-line global-require
    methods.removeActorTheme = require('./townController/removeActorTheme');

    // eslint-disable-next-line global-require
    methods.inviteNewActor = require('./townController/inviteNewActor')(
        models,
    );

    // eslint-disable-next-line global-require
    methods.removeActor = require('./townController/removeActor');

    // eslint-disable-next-line global-require
    methods.exportActors = require('./townController/exportActors');

    // eslint-disable-next-line global-require
    methods.getRelations = require('./townController/getRelations')(
        models,
    );

    // eslint-disable-next-line global-require
    methods.findNearbyTowns = require('./townController/findNearbyTowns')(
        models,
    );

    // eslint-disable-next-line global-require
    methods.findClosedNearbyTowns = require('./townController/findClosedNearbyTowns')(
        models,
    );


    return methods;
};
