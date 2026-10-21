import { CredentialRepresentation } from './keycloak-api-types';

function buildCredentials(password: string | null, salt: string | null): CredentialRepresentation[] | undefined {
    if (!password || !salt) {
        return undefined;
    }

    const hash64Base64 = Buffer.from(password.slice(0, 128), 'hex').toString('base64');
    const saltBase64 = Buffer.from(salt, 'utf8').toString('base64');

    return [
        {
            type: 'password',
            secretData: JSON.stringify({
                value: hash64Base64,
                salt: saltBase64,
            }),
            credentialData: JSON.stringify({
                hashIterations: 10000,
                algorithm: 'pbkdf2-sha512',
                additionalParameters: {},
            }),
            temporary: false,
        },
    ];
}

export default buildCredentials;
