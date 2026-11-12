import { expect } from 'chai';
import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import { getActionFullNames, getActionFullName } from './formatActionFullName';

describe('formatActionFullName', () => {
    describe('getActionFullNames', () => {
        it(' retourne une Map vide si aucun ID n\'est fourni', async () => {
            const result = await getActionFullNames([]);
            expect(result).to.be.instanceOf(Map);
            expect(result.size).to.equal(0);
        });

        it(' retourne le nom complet au format "structure - projet" pour une action avec opérateur principal', async () => {
            const rows = await sequelize.query(
                `SELECT ao.fk_action as action_id
                 FROM action_operators ao
                 WHERE ao.is_principal = true
                 LIMIT 1`,
                { type: QueryTypes.SELECT },
            );

            if (rows.length > 0) {
                const actionId = (rows[0] as { action_id: number }).action_id;
                const result = await getActionFullNames([actionId]);

                expect(result).to.be.instanceOf(Map);
                expect(result.size).to.equal(1);

                const fullName = result.get(actionId);
                expect(fullName).to.exist;
                expect(fullName).to.include(' - ');
            }
        });

        it(' retourne uniquement le nom du projet si aucun opérateur principal n\'existe', async () => {
            const rows = await sequelize.query(
                `SELECT action_id FROM actions 
                 WHERE action_id NOT IN (
                     SELECT fk_action FROM action_operators WHERE is_principal = true
                 ) LIMIT 1`,
                { type: QueryTypes.SELECT },
            );

            if (rows.length > 0) {
                const actionId = (rows[0] as { action_id: number }).action_id;
                const result = await getActionFullNames([actionId]);
                const fullName = result.get(actionId);

                expect(fullName).to.exist;
                expect(fullName).to.not.include(' - ');
            }
        });

        it(' gère correctement plusieurs actions', async () => {
            const rows = await sequelize.query(
                'SELECT action_id FROM actions LIMIT 3',
                { type: QueryTypes.SELECT },
            );

            if (rows.length > 0) {
                const actionIds = rows.map(row => (row as { action_id: number }).action_id);
                const result = await getActionFullNames(actionIds);

                expect(result).to.be.instanceOf(Map);
                expect(result.size).to.equal(actionIds.length);

                actionIds.forEach((id) => {
                    expect(result.has(id)).to.be.true;
                    expect(result.get(id)).to.be.a('string');
                });
            }
        });

        it(' utilise l\'abréviation de l\'organisation si disponible', async () => {
            const rows = await sequelize.query(
                `SELECT ao.fk_action as action_id
                 FROM action_operators ao
                 INNER JOIN users u ON u.user_id = ao.fk_user
                 INNER JOIN organizations org ON org.organization_id = u.fk_organization
                 WHERE ao.is_principal = true 
                 AND org.abbreviation IS NOT NULL 
                 AND org.abbreviation != ''
                 LIMIT 1`,
                { type: QueryTypes.SELECT },
            );

            if (rows.length > 0) {
                const actionId = (rows[0] as { action_id: number }).action_id;
                const result = await getActionFullNames([actionId]);
                const fullName = result.get(actionId);

                expect(fullName).to.exist;
                expect(fullName).to.include(' - ');
            }
        });
    });

    describe('getActionFullName', () => {
        it(' retourne le nom complet pour une action existante', async () => {
            const rows = await sequelize.query(
                'SELECT action_id FROM actions LIMIT 1',
                { type: QueryTypes.SELECT },
            );

            if (rows.length > 0) {
                const actionId = (rows[0] as { action_id: number }).action_id;
                const result = await getActionFullName(actionId);

                expect(result).to.exist;
                expect(result).to.be.a('string');
                expect(result!.length).to.be.greaterThan(0);
            }
        });

        it(' retourne null pour une action inexistante', async () => {
            const result = await getActionFullName(999999);
            expect(result).to.be.null;
        });

        it(' retourne le même résultat que getActionFullNames pour un seul ID', async () => {
            const rows = await sequelize.query(
                'SELECT action_id FROM actions LIMIT 1',
                { type: QueryTypes.SELECT },
            );

            if (rows.length > 0) {
                const actionId = (rows[0] as { action_id: number }).action_id;
                const singleResult = await getActionFullName(actionId);
                const multiResult = await getActionFullNames([actionId]);

                expect(singleResult).to.equal(multiResult.get(actionId) ?? null);
            }
        });
    });
});
