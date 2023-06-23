import { ApplicationError, ApplicationErrorType } from "../Errors/ApplicationErrors";
import { Client, ClientType } from "./client";
import Registry from "./registry";
import {Client as PgClient} from "pg";
import { Result } from "../utils";

export default class PostgresRegistry implements Registry {

    constructor(private client: PgClient) {
    };

    async connect() {
        await this.client.connect();
    }

    async register(client: Client): Promise<Result<string>> {
        return new Promise(async (resolve , reject) => {
            
            const queryText = "INSERT INTO Clients (PasswordHash, Type, RedirectionUri, email, "
            + "ApplicationName) VALUES($1, $2, $3, $4, $5) RETURNING ID;";

            try {

                let result = await this.client.query(queryText , [
                    client.passwordHash,
                    client.type,
                    client.redirectionUri,
                    client.email,
                    client.applicationName,
                ]);

                
                return resolve(new Result<string>(result.rows.at(0).id , undefined));
            
            }  catch(e: any) {

                if(e.constraint = "clients_email_key") {
                    let error = new ApplicationError("Invalid email (duplicated)",
                    ApplicationErrorType.duplicateEmail);

                    return resolve(new Result<string>(undefined , error));

                }

                return Error("");

            }

        });
    }
 
    async get(id: string): Promise<Result<Client>> {
        return new Promise(async (resolve , rejeect) => {
            const results = await this.client.query("SELECT * FROM Clients WHERE id=$1" , [id]);
            
            const temp = results.rows.at(0);

            const client: Client = {
                email:temp["email"],
                applicationName:temp["applicationname"],
                id:temp["id"],
                passwordHash:temp["passwordhash"],
                redirectionUri:temp["redirectionuri"],
                type:temp["type"]
            }

            return resolve(new Result<Client>(client , undefined));
        });
    }

    async update(id: string, update: Client): Promise<boolean> {
        return false
    }

    async delete(id: string): Promise<boolean> {
        return false
    }

    async deleteWithPassword(id: string, password: string): Promise<boolean> {
        return false
    }

};