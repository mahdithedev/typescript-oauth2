export enum ProtocolErrorType {
    invalidRequest = "invalid_request",
    unauthorizedClient = "unauthorized_client",
    accessDenied = "access_denied",
    unsupportedResponseType = "unsupported_response_type",
    invalidScope = "invalid_scope",
    serverError = "server_error",
    temporarilyUnavailable = "temporarily_unavailable"
}

export class ProtocolError extends Error {

    constructor(message: string , public type: ProtocolErrorType) {
        super(message);
        this.name = "ProtocolError";
    }

}