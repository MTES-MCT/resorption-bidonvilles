import axios from 'axios';
import config from '#server/config';

type Recipient = {
    email: string,
    first_name?: string,
    last_name?: string,
};

type MailContent = {
    HTMLPart: string,
    TextPart: string,
    Subject: string,
};

type HedwigeSendResponse = {
    status: number,
};

const { mail: mailConfig, environnement } = config;
const {
    hedwigeBaseUrl, hedwigeTokenManagerUrl, hedwigeConsumerKey, hedwigeConsumerSecret,
    tokenExpirationMarginMs, maxRateLimitRetries, defaultRateLimitRetryDelayMs,
} = mailConfig;
const expeditorAddress: string | undefined = environnement === 'development'
    ? (mailConfig.expeditorDevAddress || mailConfig.expeditorAddress)
    : mailConfig.expeditorAddress;

let cachedToken: string | null = null;
let cachedTokenExpiresAt = 0;

const fetchHedwigeToken = async (): Promise<string> => {
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

    cachedToken = data.access_token;
    cachedTokenExpiresAt = Date.now() + (data.expires_in * 1000) - tokenExpirationMarginMs;

    return cachedToken;
};

const getValidHedwigeToken = (): Promise<string> => {
    if (cachedToken !== null && Date.now() < cachedTokenExpiresAt) {
        return Promise.resolve(cachedToken);
    }

    return fetchHedwigeToken();
};

const wait = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

const getRateLimitRetryDelay = (retryAfterHeader: string | undefined): number => {
    if (!retryAfterHeader) {
        return defaultRateLimitRetryDelayMs;
    }

    const retryAfterMs = new Date(retryAfterHeader).getTime() - Date.now();

    return retryAfterMs > 0 ? retryAfterMs : defaultRateLimitRetryDelayMs;
};

const sendHedwigeEmailWithRetry = async (
    request: object,
    token: string,
    attempt: number = 1,
): Promise<HedwigeSendResponse> => {
    try {
        const { status } = await axios.post(`${hedwigeBaseUrl}/email`, request, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        return { status };
    } catch (error) {
        if (error.response?.status !== 429 || attempt >= maxRateLimitRetries) {
            throw error;
        }

        await wait(getRateLimitRetryDelay(error.response.headers['retry-after']));

        return sendHedwigeEmailWithRetry(request, token, attempt + 1);
    }
};

export default {
    async send(
        user: Recipient,
        mailContent: MailContent,
        replyTo: Recipient | null = null,
        bcc: Recipient[] = [],
    ): Promise<HedwigeSendResponse> | null {
        if (!hedwigeBaseUrl) {
            return null;
        }

        const {
            HTMLPart: html, TextPart: text, Subject: subject,
        } = mailContent;

        const token = await getValidHedwigeToken();

        return sendHedwigeEmailWithRetry(
            {
                from: expeditorAddress,
                to: [user.email],
                replyTo: replyTo !== null ? replyTo.email : undefined,
                bcc: bcc.length > 0 ? bcc.map(({ email }) => email) : undefined,
                subject,
                html,
                text,
            },
            token,
        );
    },
};
