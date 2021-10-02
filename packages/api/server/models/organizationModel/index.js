const activate = require('./activate');
const create = require('./create');
const findAssociationName = require('./findAssociationName');
const findByCategory = require('./findByCategory');
const findByType = require('./findByType');
const findOneAssociation = require('./findOneAssociation');
const findOneById = require('./findOneById');
const findOneByLocation = require('./findOneByLocation');
const getName = require('./getName');
const setCustomPermissions = require('./setCustomPermissions');
const setIntervenant = require('./setIntervenant');

module.exports = () => ({
    activate,
    create,
    findAssociationName,
    findByCategory,
    findByType,
    findOneAssociation,
    findOneById,
    findOneByLocation,
    getName,
    setCustomPermissions,
    setIntervenant,
});
