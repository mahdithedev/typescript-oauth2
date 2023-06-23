import { RedisClientType } from "redis";
import Registry from "./registry";
import { Result } from "../utils";

export default class MemoryRegistry implements Registry {

    private store = new Map<string , string>();

   constructor()  {};

   async set(key: string, value: string): Promise<Result<boolean>> {
       return new Promise(async (resolve , reject) => {

            this.store.set(key , value);
            return resolve(new Result(true , undefined));

       });
   }

   async get(key: string): Promise<Result<string>> {
       
    // fix this later
    return new Promise(async (resolve , reject) => {
        return resolve(new Result(this.store.get(key) as string , undefined));
    })

   }

   async delete(key: string): Promise<Result<boolean>> {
        return new Promise(async (resolve , reject) => {
            this.store.delete(key);
            return resolve(new Result(true , undefined));
        });   
   }

   async update(key: string, newVal: string): Promise<Result<boolean>> {
       return this.set(key , newVal);
   }

   async connect() {
        return;
   }

}