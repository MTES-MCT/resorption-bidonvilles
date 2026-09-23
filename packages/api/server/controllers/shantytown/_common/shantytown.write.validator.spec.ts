import chai from 'chai';
import { serialized as generateUser } from '#test/utils/user';
import { serialized as generateTown } from '#test/utils/shantytown';
import locationUtils from '#test/utils/location';
import { checkWritePermissions } from './shantytown.write.validator';

const { expect } = chai;
const { paris, marseille } = locationUtils;

// utilisateur ayant le droit d'écrire uniquement sur les sites de la commune de Paris (75056)
const restrictedToParis = () => generateUser({
    permissions: {
        shantytown: {
            create: {
                allowed: true,
                allowed_on_national: false,
                allowed_on: {
                    regions: [], departements: [], epci: [], cities: [paris.city()], actions: [],
                },
            },
            update: {
                allowed: true,
                allowed_on_national: false,
                allowed_on: {
                    regions: [], departements: [], epci: [], cities: [paris.city()], actions: [],
                },
            },
            report: {
                allowed: true,
                allowed_on_national: false,
                allowed_on: {
                    regions: [], departements: [], epci: [], cities: [paris.city()], actions: [],
                },
            },
        },
    },
});

describe('controllers/shantytown/_common/shantytown.write.validator - checkWritePermissions()', () => {
    describe('vérification du territoire de la commune soumise (req.body.city)', () => {
        it('lève une erreur si l\'utilisateur n\'a pas le droit de créer un site sur la commune soumise', () => {
            const req = {
                user: restrictedToParis(),
                body: { city: marseille.city() },
            };

            expect(() => checkWritePermissions('create', req)).to.throw('Vous n\'avez pas le droit de déclarer un site sur ce territoire');
        });

        it('n\'échoue pas si l\'utilisateur a le droit d\'écrire sur la commune soumise', () => {
            const req = {
                user: restrictedToParis(),
                body: { city: paris.city() },
            };

            expect(checkWritePermissions('create', req)).to.equal(true);
        });
    });

    describe('vérification du territoire du site réellement ciblé (req.town), en mode "update"', () => {
        it('lève une erreur si req.town appartient à un territoire hors du périmètre autorisé, même si req.body.city est autorisé', () => {
            // Scénario de la faille corrigée : l'utilisateur soumet le citycode de SA commune
            // autorisée (Paris), alors que le site réellement ciblé par :id (req.town) se
            // trouve dans une autre commune (Marseille) hors de son périmètre.
            const req = {
                user: restrictedToParis(),
                body: { city: paris.city() },
                town: generateTown(marseille.city()),
            };

            expect(() => checkWritePermissions('update', req)).to.throw('Vous n\'avez pas le droit de modifier un site sur ce territoire');
        });

        it('n\'échoue pas si req.town appartient au périmètre autorisé', () => {
            const req = {
                user: restrictedToParis(),
                body: { city: paris.city() },
                town: generateTown(paris.city()),
            };

            expect(checkWritePermissions('update', req)).to.equal(true);
        });

        it('n\'échoue pas si req.town est absent (cas hors mise à jour ou site non encore résolu)', () => {
            const req = {
                user: restrictedToParis(),
                body: { city: paris.city() },
            };

            expect(checkWritePermissions('update', req)).to.equal(true);
        });

        it('ne vérifie pas req.town en dehors du mode "update"', () => {
            const req = {
                user: restrictedToParis(),
                body: { city: paris.city() },
                town: generateTown(marseille.city()),
            };

            expect(checkWritePermissions('create', req)).to.equal(true);
        });
    });

    describe('messages d\'erreur selon le mode', () => {
        it('utilise le bon wording pour le mode "report"', () => {
            const req = {
                user: restrictedToParis(),
                body: { city: marseille.city() },
            };

            expect(() => checkWritePermissions('report', req)).to.throw('Vous n\'avez pas le droit d\'informer d\'un nouveau site sur ce territoire');
        });
    });
});
