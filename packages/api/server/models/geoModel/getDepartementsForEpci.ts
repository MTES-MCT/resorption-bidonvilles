import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

/**
 * Retourne la liste des codes départements associés à un EPCI donné.
 * Un EPCI peut chevaucher plusieurs départements.
 *
 * @param {string} epciCode - Code de l'EPCI
 * @returns {Promise<string[]>} - Liste des codes départements (array de strings)
 */
const getDepartementsForEpci = async (epciCode: string): Promise<string[]> => {
    const [result]: any = await sequelize.query(
        'SELECT departements FROM epci_departements WHERE fk_epci = :epciCode',
        {
            type: QueryTypes.SELECT,
            replacements: { epciCode },
        },
    );

    return result?.departements ?? [];
};

export default getDepartementsForEpci;
