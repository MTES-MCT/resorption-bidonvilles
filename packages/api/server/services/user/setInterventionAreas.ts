import { sequelize } from '#db/sequelize';
import ServiceError from '#server/errors/ServiceError';
import findOneUser from '#server/models/userModel/findOne';
import setOrganizationInterventionAreas from '#server/models/organizationModel/setInterventionAreas';
import setUserInterventionAreas from '#server/models/userModel/setInterventionAreas';
import { InputInterventionArea } from '#root/types/inputs/InterventionArea.d';
import { User } from '#root/types/resources/User.d';

export default async (updatedBy: User, user: User, organizationAreas: InputInterventionArea[], userAreas: InputInterventionArea[]): Promise<User> => {
    const transaction = await sequelize.transaction();

    let updatedUser: User;
    try {
        await Promise.all([
            setOrganizationInterventionAreas(user.organization.id, organizationAreas, transaction),
            setUserInterventionAreas(user.id, userAreas, transaction),
        ]);

        updatedUser = await findOneUser(user.id, { extended: true }, updatedBy, undefined, transaction);
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw new ServiceError('database_error', error);
    }

    return updatedUser;
};
