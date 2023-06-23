export enum ClientType {
    confidential = "confidential",
    public = "public",
}

export interface Client {
    id: string,
    passwordHash: string,
    type: ClientType,
    redirectionUri: string,
    email: string,
    applicationName: string,
}