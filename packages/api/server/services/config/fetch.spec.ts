import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import rewiremock from 'rewiremock/node';
import { serialized as fakeUser } from '#test/utils/user';
import ServiceError from '#server/errors/ServiceError';

const { expect } = chai;
chai.use(sinonChai);
chai.use(chaiAsPromised);

// stubs
const sandbox = sinon.createSandbox();
const actionFinanceTypeModel = {
    findAll: sandbox.stub(),
};
const changelogModel = {
    getChangelogFor: sandbox.stub(),
};
const charteEngagementModel = {
    getLatest: sandbox.stub(),
};
const closingSolutionModel = {
    findAll: sandbox.stub(),
};
const commentTagModel = {
    find: sandbox.stub(),
};
const departementModel = {
    findAll: sandbox.stub(),
};
const electricityTypeModel = {
    findAll: sandbox.stub(),
};
const expertiseTopicModel = {
    findAll: sandbox.stub(),
};
const fieldTypeModel = {
    findAll: sandbox.stub(),
};
const ownerTypeModel = {
    findAll: sandbox.stub(),
};
const questionTagModel = {
    findAll: sandbox.stub(),
};
const regionModel = {
    findAll: sandbox.stub(),
};
const socialOriginModel = {
    findAll: sandbox.stub(),
};
const topicModel = {
    findAll: sandbox.stub(),
};
const userModel = {
    findOne: sandbox.stub(),
};
const preparatoryPhasesTowardResorptionModel = {
    getAll: sandbox.stub(),
};
const heatwaveService = {
    get: sandbox.stub(),
};

rewiremock('#server/config').withDefault({
    activationTokenExpiresIn: '1',
});
rewiremock('#server/permissions_description').withDefault({
    foo: 'bar',
});
rewiremock('#server/config/shantytown_actor_themes').withDefault({
    bar: 'foo',
});
rewiremock('#server/models/actionFinanceTypeModel/index').with(actionFinanceTypeModel);
rewiremock('#server/models/changelogModel/index').with(changelogModel);
rewiremock('#server/models/charteEngagementModel/index').with(charteEngagementModel);
rewiremock('#server/models/closingSolutionModel/index').with(closingSolutionModel);
rewiremock('#server/models/commentTagModel/index').with(commentTagModel);
rewiremock('#server/models/departementModel/index').with(departementModel);
rewiremock('#server/models/electricityTypeModel/index').with(electricityTypeModel);
rewiremock('#server/models/expertiseTopicsModel/index').with(expertiseTopicModel);
rewiremock('#server/models/fieldTypeModel/index').with(fieldTypeModel);
rewiremock('#server/models/ownerTypeModel/index').with(ownerTypeModel);
rewiremock('#server/models/questionTagModel/index').with(questionTagModel);
rewiremock('#server/models/regionModel/index').with(regionModel);
rewiremock('#server/models/socialOriginModel/index').with(socialOriginModel);
rewiremock('#server/models/topicModel/index').with(topicModel);
rewiremock('#server/models/userModel/index').with(userModel);
rewiremock('#server/models/preparatoryPhasesTowardResorptionModel/index').with(preparatoryPhasesTowardResorptionModel);
rewiremock('#server/services/heatwave/index').with(heatwaveService);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import fetch from './fetch';
rewiremock.disable();

describe('configService.fetch()', () => {
    afterEach(() => {
        sandbox.reset();
    });

    it('retourne la liste des descriptions de permissions', async () => {
        const result = await fetch(fakeUser());
        expect(result.permissions_description).to.be.eql({
            foo: 'bar',
        });
    });

    it('retourne la liste des thèmes d\'intervention sur un site', async () => {
        const result = await fetch(fakeUser());
        expect(result.actor_themes).to.be.eql({
            bar: 'foo',
        });
    });

    it('retourne le délai de validité d\'un token d\'activation, en heures', async () => {
        const result = await fetch(fakeUser());
        expect(result.activation_token_expires_in).to.be.eql(3600);
    });

    it('retourne la liste des types de financement d\'actions', async () => {
        actionFinanceTypeModel.findAll.resolves(['A', 'B']);
        const result = await fetch(fakeUser());
        expect(result.action_finance_types).to.be.eql(['A', 'B']);
    });

    it('retourne la liste des changelogs à afficher à l\'utilisateur courant', async () => {
        const user = fakeUser();
        changelogModel.getChangelogFor.withArgs(user).resolves(['A', 'B']);
        const result = await fetch(user);
        expect(result.changelog).to.be.eql(['A', 'B']);
    });

    it('retourne la charte d\'engagement à signer (s\'il y en a une)', async () => {
        charteEngagementModel.getLatest.resolves({ version: 2 });
        const result = await fetch(fakeUser());
        expect(result.version_charte_engagement).to.be.eql({ version: 2 });
    });

    it('retourne la liste des closing solutions', async () => {
        closingSolutionModel.findAll.resolves(['A', 'B']);
        const result = await fetch(fakeUser());
        expect(result.closing_solutions).to.be.eql(['A', 'B']);
    });

    it('retourne la liste des tags de commentaires', async () => {
        commentTagModel.find.withArgs({}).resolves(['A', 'B']);
        const result = await fetch(fakeUser());
        expect(result.comment_tags).to.be.eql(['A', 'B']);
    });

    it('retourne la liste des départements', async () => {
        departementModel.findAll.resolves(['A', 'B']);
        const result = await fetch(fakeUser());
        expect(result.departements).to.be.eql(['A', 'B']);
    });

    it('retourne la liste des types d\'accès à l\'électricité', async () => {
        electricityTypeModel.findAll.resolves(['A', 'B']);
        const result = await fetch(fakeUser());
        expect(result.electricity_types).to.be.eql(['A', 'B']);
    });

    it('retourne la liste des sujets d\'intérêts / expertise', async () => {
        expertiseTopicModel.findAll.resolves(['A', 'B']);
        const result = await fetch(fakeUser());
        expect(result.expertise_topics).to.be.eql(['A', 'B']);
    });

    it('retourne la liste des field_types', async () => {
        fieldTypeModel.findAll.resolves(['A', 'B']);
        const result = await fetch(fakeUser());
        expect(result.field_types).to.be.eql(['A', 'B']);
    });

    it('retourne la liste des owner_types', async () => {
        ownerTypeModel.findAll.resolves(['A', 'B']);
        const result = await fetch(fakeUser());
        expect(result.owner_types).to.be.eql(['A', 'B']);
    });

    it('retourne la liste des tags de questions', async () => {
        questionTagModel.findAll.resolves(['A', 'B']);
        const result = await fetch(fakeUser());
        expect(result.question_tags).to.be.eql(['A', 'B']);
    });

    it('retourne la liste des régions', async () => {
        regionModel.findAll.resolves(['A', 'B']);
        const result = await fetch(fakeUser());
        expect(result.regions).to.be.eql(['A', 'B']);
    });

    it('retourne la liste des social origins', async () => {
        socialOriginModel.findAll.resolves(['A', 'B']);
        const result = await fetch(fakeUser());
        expect(result.social_origins).to.be.eql(['A', 'B']);
    });

    it('retourne la liste des thématiques d\'action', async () => {
        topicModel.findAll.resolves(['A', 'B']);
        const result = await fetch(fakeUser());
        expect(result.topics).to.be.eql(['A', 'B']);
    });

    it('retourne l\'utilisateur identifié avec le détail de ses permissions', async () => {
        const user = fakeUser({ id: 42 });
        userModel.findOne.withArgs(42, { extended: true }).resolves(user);
        const result = await fetch(user);
        expect(result.user).to.be.eql(user);
    });

    it('retourne la liste des phases transitoires vers la résorption', async () => {
        preparatoryPhasesTowardResorptionModel.getAll.resolves(['A', 'B']);
        const result = await fetch(fakeUser());
        expect(result.preparatory_phases_toward_resorption).to.be.eql(['A', 'B']);
    });

    it('retourne les données de la vague de chaleur en cours', async () => {
        const fakeHeatwave = { start_date: new Date(), end_date: new Date(), isPeriodActive: true };
        heatwaveService.get.resolves(fakeHeatwave);
        const result = await fetch(fakeUser());
        expect(heatwaveService.get).to.have.been.calledOnce;
        expect(result.heatwave).to.eql(fakeHeatwave);
    });

    it('lance un ServiceError si une requête échoue', async () => {
        const error = new Error('whatever');
        regionModel.findAll.rejects(error);

        try {
            await fetch(fakeUser());
        } catch (e) {
            expect(e).to.be.an.instanceOf(ServiceError);
            expect(e.message).to.be.eql('whatever');
            expect(e.nativeError).to.be.eql(error);
            return;
        }

        expect.fail('ServiceError non lancée');
    });
});
