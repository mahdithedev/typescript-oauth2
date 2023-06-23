export enum ApplicationErrorType {
    duplicateEmail = "duplicate_email",
    ClientNotRegistered = "client_not_registered",
}

export class ApplicationError extends Error {

    constructor(message: string , public type: ApplicationErrorType) {
        super(message);
        this.name = "ApplicationError"
    }

}