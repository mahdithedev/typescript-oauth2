import {Request, Response} from "express";
import { CodeInfoType, checkAll, generate_random_value } from "../lib/utils";
import {default as TempRegistry} from "../lib/TemporaryRegistry/registry";
import Registry from "../lib/ClientRegistry/registry";
import { ClientType } from "../lib/ClientRegistry/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export default function TokenRoute(
    registry: Registry,
    tempRegistry: TempRegistry 
    ) {
    return async (req: Request, res: Response) => {

        // authentication_failed_response
        const afs = {
            error:"invalid_client",
            error_description:"authentication failed"
        };
        
        const allValid = checkAll(req.body, 
            ["grant_type", "code", "rediraction_uri"]
        );

        if(!allValid) {
            return res.status(400).json(afs);
        }

        const grantType = req.body.grant_type;
        const code = req.body.code;
        const rediractionUri = req.body.rediraction_uri;

        if(req.headers.authorization && 
           req.headers.authorization.slice(0 , 5).toLocaleLowerCase() === "basic") {

            const buf = Buffer.from(req.headers.authorization.split(" ")[1] , "base64");
            [req.body.client_id , req.body.client_secret] = buf.toString("utf-8").split(":");

        };

        if(!("client_id" in req.body)) {
            return res.status(400).json(afs);
        }

        const clientID = req.body.client_id;
        const result = await registry.get(clientID);

        if(result.isWrong()) {
            return res.status(400).json(afs);
        }

        const client = result.okay;

        if(client.type == ClientType.confidential) {

            if(!("client_secret" in req.body)) {
                return res.status(400).json(afs);
            }

            const clientSecret = req.body.client_secret;

            if(!(await bcrypt.compare(clientSecret , client.passwordHash))) {
                return res.status(400).json(afs);
            }

        };

        console.log(await tempRegistry.get(code));
        const codeInfo: CodeInfoType = JSON.parse((await tempRegistry.get(code)).okay); 

        if(client.id !== codeInfo.clientID) {
            return res.status(400).json({
                error:"invalid_grant"
            })
        }

        if(codeInfo.rediractionUri !== rediractionUri) {
            return res.status(400).json({
                error:"invalid_request",
                error_description:"wrong rediraction_uri"
            })
        }

        // IMPORTANT i must check if the code is used more that once

        const accessToken = jwt.sign({
            random_value:generate_random_value(),
        } , (process.env.SECRET as string) , {expiresIn:"3h"});         

        return res.json({
            access_token:accessToken,
            token_type:"Bearer",
            "expires_in":3 * 60 * 60,
        })

    };
}