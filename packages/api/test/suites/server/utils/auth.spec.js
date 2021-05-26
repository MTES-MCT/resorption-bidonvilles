const { expect } = require('chai');
const proxyquire = require('proxyquire');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const fakeConfig = {
    frontUrl: global.generate('string'),
    auth: {
        secret: global.generate('string'),
        expiresIn: `${global.generate('number')}h`,
    },
    activationTokenExpiresIn: `${global.generate('number')}h`,
};
const {
    generateAccessTokenFor, hashPassword, generateSalt, getAccountActivationLink,
} = proxyquire('#server/utils/auth', {
    '#server/config': fakeConfig,
});

describe('[Utils] Auth', () => {
    describe('.generateAccessTokenFor()', () => {
        it('it should return a valid token for the given user', () => {
            const fakeUser = {
                id: global.generate('number'),
                email: global.generate('string'),
            };

            expect(generateAccessTokenFor(fakeUser)).to.be.eql(
                jwt.sign(
                    {
                        userId: fakeUser.id,
                        email: fakeUser.email,
                    },
                    fakeConfig.auth.secret,
                    {
                        expiresIn: fakeConfig.auth.expiresIn,
                    },
                ),
            );
        });

        it('it uses the custom expiresIn value', () => {
            const fakeUser = {
                id: global.generate('number'),
                email: global.generate('string'),
            };

            const randomExpire = `${global.generate('number')}h`;

            expect(generateAccessTokenFor(fakeUser, randomExpire)).to.be.eql(
                jwt.sign(
                    {
                        userId: fakeUser.id,
                        email: fakeUser.email,
                    },
                    fakeConfig.auth.secret,
                    {
                        expiresIn: randomExpire,
                    },
                ),
            );
        });
    });

    describe('.hashPassword()', () => {
        it('it should return the properly hashed password', () => {
            const plainPassword = global.generate('string');
            const salt = global.generate('string');

            expect(hashPassword(plainPassword, salt)).to.be.eql(
                crypto.pbkdf2Sync(plainPassword, salt, 10000, 512, 'sha512').toString('hex'),
            );
        });
    });

    describe('.generateSalt()', () => {
        it('it should return a 32-characters long string', () => {
            const salt = generateSalt();
            expect(salt).to.be.a.string;
            expect(salt).to.have.lengthOf(32);
        });

        it('it should return a random string', () => {
            expect(generateSalt()).not.to.be.eql(generateSalt());
        });
    });

    describe('.getAccountActivationLink()', () => {
        describe('if the user is missing', () => {
            it('it throws an exception', () => {
                expect(() => {
                    getAccountActivationLink();
                }).to.throw('The user is mandatory to generate an account activation link');
            });
        });

        it('it returns the complete URL to the account activation page', () => {
            const fakeUser = {
                id: global.generate('number'),
                email: global.generate('string'),
            };

            const token = generateAccessTokenFor(fakeUser, fakeConfig.activationTokenExpiresIn);

            expect(getAccountActivationLink(fakeUser)).to.be.eql(
                `${fakeConfig.frontUrl}/activer-mon-compte/${encodeURIComponent(token)}`,
            );
        });
    });
});
