/* eslint-disable no-underscore-dangle */

class HttpError extends Error {
    constructor(code, error) {
        super(error.message);

        this._code = code;
        this._error = error;
    }

    get code() {
        return this._code;
    }

    serialize() {
        if (this._error.serialize) {
            return this._error.serialize();
        }

        return {
            user_message: this.message,
            developer_message: null,
        };
    }
}

module.exports = HttpError;
