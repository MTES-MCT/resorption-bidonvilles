import { sequelize } from '#db/sequelize';
import { log } from 'console';
import { Transaction } from 'sequelize';

export default async (id:number, transaction?:Transaction):Promise<boolean> => {    
        // await sequelize.query(
        const deleteQuestion = await sequelize.query(
            'DELETE FROM questions WHERE question_id = :id',
            {
                transaction,
                replacements: {
                    id,
                },
            },
        );
        
        const rowCount:number = deleteQuestion[0] as unknown as number;

        if (rowCount === 0) {
            console.error(`Question ${id} introuvable`);
            throw new Error(`Question ${id} introuvable`);
        } else {
            console.log(`Question ${id} supprimée`);
            return true
        }
};
