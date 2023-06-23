import crypto from "crypto";

export class Result<T> {

    constructor(public value: T | undefined , public error: Error | undefined) {};

    isOkay(): boolean {
        return !(this.value == undefined);
    }

    isWrong(): boolean {
        return !(this.error == undefined);
    }

    get okay(): T {
        return (this.value as T)
    }

    get wrong(): Error {
        return (this.error as Error)
    }

}

export function checkAll(obj: Object , properties: string[]): boolean {
  
    for(let i = 0 ; i < properties.length ; i++) {
      if(!(properties[i] in obj)) {
        return false
      }
    }
    
    return true
  
};

export function generate_random_value() {
    return crypto.randomBytes(32).toString("hex");
}

export function generate_code() {
    return generate_random_value();
};

export type CodeInfoType = {
    code: string,
    clientID: string,
    rediractionUri: string,
    requestedScope: string,
    state: string,
    responseType: string,
    authorized: boolean
};