"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
class CustomError extends Error {
    constructor(customErrorObject, ...params) {
        super(...params);
        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, CustomError);
        }
        this.name = 'CustomError';
        this.message = customErrorObject.message;
        this.data = customErrorObject.data;
    }
    is404() {
        return Array.isArray(this.data) && this.data[0].message === "Not Found.";
    }
}
exports.CustomError = CustomError;
