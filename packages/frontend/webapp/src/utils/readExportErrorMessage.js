function readBlobAsText(blob) {
    if (typeof blob.text === "function") {
        return blob.text();
    }

    return new Promise(function readWithFileReader(resolve, reject) {
        const reader = new FileReader();
        reader.onload = function onLoad() {
            resolve(String(reader.result));
        };
        reader.onerror = function onError() {
            reject(reader.error);
        };
        reader.readAsText(blob);
    });
}

function extractUserMessage(data) {
    if (
        data !== null &&
        typeof data === "object" &&
        typeof data.user_message === "string" &&
        data.user_message.trim() !== ""
    ) {
        return data.user_message;
    }

    return null;
}

/**
 * Extrait le `user_message` renvoyé par l'API lors de l'échec d'une requête
 * faite en `responseType: "blob"`.
 *
 * Dans ce cas, le corps de l'erreur arrive sous forme de `Blob` et non d'objet.
 * L'intercepteur axios (helpers/axios.js) ne le reconnaît pas et rejette une
 * erreur générique dont l'erreur d'origine est dans `error.error`.
 *
 * Renvoie `null` quand aucun message exploitable n'est trouvé (pas de réponse,
 * corps non JSON, pas de `user_message`) : l'appelant garde alors son message
 * générique.
 *
 * @param {*} error Erreur rejetée par la requête
 * @returns {Promise<string|null>}
 */
export default async function readExportErrorMessage(error) {
    const data = error?.error?.response?.data ?? error?.response?.data;

    if (data === undefined || data === null) {
        return null;
    }

    if (typeof Blob !== "undefined" && data instanceof Blob) {
        try {
            const text = await readBlobAsText(data);
            return extractUserMessage(JSON.parse(text));
        } catch {
            return null;
        }
    }

    return extractUserMessage(data);
}
