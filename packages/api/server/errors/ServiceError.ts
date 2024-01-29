export default class ServiceError extends Error {
    code: string;

    nativeError: Error;

    constructor(code: string, nativeError: Error) {
        super(nativeError.message);
        Object.setPrototypeOf(this, ServiceError.prototype);

        this.code = code;
        this.nativeError = nativeError;
    }
}
