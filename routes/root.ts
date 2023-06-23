import { Request , Response } from "express";
import Registry from "../lib/ClientRegistry/registry";
import { CodeInfoType, checkAll, generate_code } from "../lib/utils";
import { ProtocolErrorType } from "../lib/Errors/ProtocolErros";
import OauthResponseType from "../lib/responseType";
import TempRegistry from "../lib/TemporaryRegistry/registry";

export default function RootRoute(
    registry: Registry,
    AvailableScopes: string[],
    tempRegistry: TempRegistry) {


    return async (req: Request , res: Response) => {

        if(!("client_id" in req.query)) {
            res.statusCode = 400
            return res.json({
              error:"400 bad request error. You see this page beacuse of an error in the client."
            })
          }
        
          const clientID = (req.query.client_id as string);
        
          const client = (await registry.get((clientID as string))).okay;
        
          if(!client) {
            res.statusCode = 400;
            return res.json({
              error:"400 bad request error. An unrigistered client tried to access your resources"
            })
          }
        
          const validRediractionUris = [];
          let rediractionUri = req.query.rediraction_uri;
        
          if(rediractionUri) {
            if(client.redirectionUri !== rediractionUri) {
              res.statusCode = 400;
              return res.json({
                error: "400 bad request error. The client sent an invalid callback uri"
              })
            }
          }
        
          const argumentsValid = checkAll(req.query , 
            ["response_type" , "scope"]
          );
        
          if(!argumentsValid) {
            return res.redirect(`${rediractionUri}?error=${ProtocolErrorType.invalidRequest}`);
          }
        
          const responseType = (req.query.response_type as OauthResponseType);
        
          const requestedScope = (req.query.scope as string);
          const state = (req.query.state as string);
        
          rediractionUri = client.redirectionUri;
        
          if(!AvailableScopes.includes(requestedScope)) {
            return res.redirect(`${rediractionUri}?error=${ProtocolErrorType.invalidScope}`);
          };
        
          if(responseType == OauthResponseType.code) {
        
            const code = generate_code();
        
            let t: CodeInfoType = {
              code,
              clientID,
              rediractionUri,
              requestedScope,
              state,
              responseType,
              authorized:false,
            };

            tempRegistry.set(code , JSON.stringify(t));
        
            res.cookie("code" , t , {signed:true});
            return res.sendFile(process.cwd() + "/pages/code_flow.html");
            
          };
        
          if(responseType == OauthResponseType.token) {

          };
        
          res.redirect(`${rediractionUri}?error=${ProtocolErrorType.unsupportedResponseType}`);
    }

}