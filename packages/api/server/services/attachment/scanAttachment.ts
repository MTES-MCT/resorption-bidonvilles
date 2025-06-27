import axios from 'axios';
import FormData from 'form-data';
import { Readable } from 'stream';
import CONFIG from '#server/config';
import scanAttachmentErrors from './scanAttachmentErrors';

export type ClamAVResponse = {
    status: number,
    message: string;
};

export default async (file: Express.Multer.File): Promise<ClamAVResponse> => {
    try {
        const formData = new FormData();
        const bufferStream = new Readable();
        bufferStream.push(file.buffer);
        bufferStream.push(null);

        formData.append('file', bufferStream, {
            filename: file.originalname,
            contentType: file.mimetype,
        });

        const response = await axios.post(
            `http://${CONFIG.clamav.host}:${CONFIG.clamav.port}/scan`,
            formData,
            { headers: formData.getHeaders() },
        );

        return {
            status: response.status,
            message: scanAttachmentErrors[response.status].message,
        };
    } catch (error) {
        // Vérifier si l'erreur provient d'axios
        if (axios.isAxiosError(error)) {
            const errorCodes = Object.keys(scanAttachmentErrors);
            if (errorCodes.includes(error.response.status.toString())) {
                return {
                    status: error.response?.status || 500,
                    message: scanAttachmentErrors[error.response?.status].message ?? 'undefined',
                };
            }
        }
        // Gérer d'autres types d'erreurs
        return {
            status: 500,
            message: 'undefined',
        };
    }
};
