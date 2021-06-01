class FormError extends Error {
    constructor(userMessage, developerMessage, fieldErrors = null) {
        super(userMessage);

        this.developerMessage = developerMessage;
        this.fieldErrors = fieldErrors;
    }

    serialize() {
        const obj = {
            user_message: this.message,
            developer_message: this.developerMessage,
        };

        if (this.fieldErrors !== null) {
            obj.fields = this.fieldErrors;
        }

        return obj;
    }
}

module.exports = FormError;
