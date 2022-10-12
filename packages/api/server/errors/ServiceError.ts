module.exports = class ServiceError extends Error {
    /**
     * @param {String} code Un code interne d'identification de l'erreur
     * @param {Error} nativeError Erreur originelle
     */
    constructor(code, nativeError) {
        super(nativeError.message, nativeError.fileName, nativeError.lineNumber);
        Object.setPrototypeOf(this, ServiceError.prototype);

        this.code = code;
        this.nativeError = nativeError;
    }
};
