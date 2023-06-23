import { RedisClientType } from "redis";
import Registry from "./registry";
import { Result } from "../utils";

export default class RedisRegistry implements Registry {

   constructor(private client: RedisClientType)  {};

   async set(key: string, value: string): Promise<Result<boolean>> {
       return new Promise(async (resolve , reject) => {

            await this.client.set(key , value);
            resolve(new Result(true , undefined));

       });
   }

   async get(key: string): Promise<Result<string>> {
       
    // fix this later
    return new Promise(async (resolve , reject) => {
        return resolve(new Result((await this.client.get(key)) as string , undefined));
    })

   }

   update(key: string, newVal: string): Promise<Result<boolean>> {
       return new Promise((resolve , reject) => {
        return resolve(new Result(true , undefined));
       })
   }

   async delete(key: string): Promise<Result<boolean>> {
        return new Promise(async (resolve , reject) => {
            await this.client.del(key);
            return resolve(new Result(true , undefined));
        });   
   }

   async connect() {
        await this.client.connect();
   }

}