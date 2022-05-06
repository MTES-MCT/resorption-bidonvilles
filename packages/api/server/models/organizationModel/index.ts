import activate from './activate';
import updateBeingFunded from './updateBeingFunded';
import create from './create';
import findAssociationName from './findAssociationName';
import findByCategory from './findByCategory';
import findByType from './findByType';
import findOneAssociation from './findOneAssociation';
import findOneById from './findOneById';
import findOneByLocation from './findOneByLocation';
import getName from './getName';

export default () => ({
    activate,
    updateBeingFunded,
    create,
    findAssociationName,
    findByCategory,
    findByType,
    findOneAssociation,
    findOneById,
    findOneByLocation,
    getName,
});
