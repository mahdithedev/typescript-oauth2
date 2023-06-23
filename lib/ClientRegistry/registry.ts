import { Client } from "./client"
import { Result } from "../utils"

// simple CRUD registry
export default interface Registry {
    register(client: Client): Promise<Result<string>>
    get(id: string): Promise<Result<Client>>
    update(id: string , update: Client): Promise<boolean>
    delete(id: string): Promise<boolean>,
    deleteWithPassword(id: string , password: string): Promise<boolean>
}