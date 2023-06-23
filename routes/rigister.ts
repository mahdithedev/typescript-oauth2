import { Request, Response } from "express";
import { checkAll } from "../lib/utils";
import bcrypt from "bcrypt";
import Registry from "../lib/ClientRegistry/registry";
import { ApplicationError } from "../lib/Errors/ApplicationErrors";

async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password , 10);
}

export default function RigisterRoute(registry: Registry) {
    return async (req: Request , res:Response) => {
        
    const argumentsValid = checkAll(req.body , 
        ["password" , "email" , "rediraction_uri" , "application_name"]
      );
  
      if(!argumentsValid) {
        return res.json({
          error:"invalid_request"
        })
      }
  
      let result = await registry.register({
        id:"",
        passwordHash: await hashPassword(req.body.password),
        email:req.body.email,
        redirectionUri:req.body.rediraction_uri,
        type:req.body.type,
        applicationName:req.body.application_name,
      });
      if(result.isWrong()) {
        return res.json({
          error: (result.wrong as ApplicationError).type
        });
      }
  
      return res.json({
        ok:true,
      });
    }
};