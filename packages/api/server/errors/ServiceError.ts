export default class ServiceError extends Error {
    code: string;

    nativeError: Error;

    /**
     * @param {String} code Un code interne d'identification de l'erreur
     * @param {Error} nativeError Erreur originelle
     */
    constructor(code: string, nativeError: Error) {
        super(nativeError.message);
        Object.setPrototypeOf(this, ServiceError.prototype);

        this.code = code;
        this.nativeError = nativeError;
    }
}
