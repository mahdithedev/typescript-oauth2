import { Result } from "../utils";

export default interface Registry {
    set(key: string , value: string): Promise<Result<boolean>>,
    get(key: string): Promise<Result<string>>,
    update(key: string , newVal: string): Promise<Result<boolean>>
    delete(key: string): Promise<Result<boolean>>
};