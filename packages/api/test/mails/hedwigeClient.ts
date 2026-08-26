import axios from 'axios';
import config from '#server/config';

const {
    hedwigeBaseUrl, hedwigeTokenManagerUrl, hedwigeConsumerKey, hedwigeConsumerSecret, expeditorAddress,
} = config.mail;

export const assertHedwigeConfigured = (): void => {
    if (
        !hedwigeBaseUrl
        || !hedwigeTokenManagerUrl
        || !hedwigeConsumerKey
        || !hedwigeConsumerSecret
        || !expeditorAddress
    ) {
        throw new Error(
            'Variables d\'environnement Hedwige manquantes: RB_API_HEDWIGE_BASE_URL, '
            + 'RB_API_HEDWIGE_API_TOKEN_MANAGER_URL, RB_API_HEDWIGE_CONSUMER_KEY, '
            + 'RB_API_HEDWIGE_CONSUMER_SECRET, RB_API_HEDWIGE_EXP_ADDRESS',
        );
    }
};

export const fetchHedwigeToken = async (): Promise<string> => {
    const credentials = Buffer.from(`${hedwigeConsumerKey}:${hedwigeConsumerSecret}`).toString('base64');

    const { data } = await axios.post(
        `${hedwigeTokenManagerUrl}/token`,
        'grant_type=client_credentials',
        {
            headers: {
                Authorization: `Basic ${credentials}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        },
    );

    return data.access_token;
};

export const sendHedwigeMail = async (
    to: string,
    subject: string,
    html: string,
    text: string,
): Promise<void> => {
    const token = await fetchHedwigeToken();

    await axios.post(
        `${hedwigeBaseUrl}/email`,
        {
            from: expeditorAddress,
            to: [to],
            subject,
            html,
            text,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        },
    );
};
