const SequelizeMock = require('sequelize-mock');
const { expect } = require('chai');

SequelizeMock.prototype.QueryTypes = {};

const factory = require('#server/models/changelogModel');
const { serialized: createUser } = require('#test/utils/user');
const { raw: createChangelogItem } = require('#test/utils/changelog');

describe.only('ChangelogModel', () => {
    describe('.getChangelogFor()', () => {
        let getChangelogFor;
        let sequelizeStub;
        beforeEach(() => {
            sequelizeStub = new SequelizeMock();
            ({ getChangelogFor } = factory(sequelizeStub));
        });

        it('Si l\'utilisateur se connecte à l\'application pour la première fois, on ne lui retourne aucun changelog', async () => {
            const changelog = await getChangelogFor(createUser({ last_changelog: null }));
            expect(changelog).to.be.eql([]);
        });

        it('Si l\'utilisateur a déjà vu le dernier changelog, on ne lui retourne aucun changelog', async () => {
            sequelizeStub.$queueResult([]);
            const changelog = await getChangelogFor(createUser());
            expect(changelog).to.be.eql([]);
        });

        it('Si l\'utilisateur n\'a pas vu le dernier changelog, on lui retourne tous les changelogs qu\'il n\'a pas vu', async () => {
            sequelizeStub.$queueResult([
                createChangelogItem({ app_version: '0.0.0', title: 'Titre 1' }),
                createChangelogItem({ app_version: '0.0.0', title: 'Titre 2' }),
                createChangelogItem({ app_version: '0.0.1' }),
            ]);
            const changelog = await getChangelogFor(createUser());
            expect(changelog).to.be.eql([
                {
                    app_version: '0.0.0',
                    date: '01 Janvier 2020',
                    title: 'Titre 1',
                    description: '<p>Description <strong>importante</strong></p>',
                    image: 'https://api.resorption-bidonvilles.localhost/assets/changelog/0.0.0/item_1.jpg',
                },
                {
                    app_version: '0.0.0',
                    date: '01 Janvier 2020',
                    title: 'Titre 2',
                    description: '<p>Description <strong>importante</strong></p>',
                    image: 'https://api.resorption-bidonvilles.localhost/assets/changelog/0.0.0/item_1.jpg',
                },
                {
                    app_version: '0.0.1',
                    date: '01 Janvier 2020',
                    title: 'Titre',
                    description: '<p>Description <strong>importante</strong></p>',
                    image: 'https://api.resorption-bidonvilles.localhost/assets/changelog/0.0.0/item_1.jpg',
                },
            ]);
        });
    });
});
