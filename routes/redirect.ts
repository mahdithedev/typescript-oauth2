import { Request, Response } from "express";
import Registry from "../lib/TemporaryRegistry/registry";
import { CodeInfoType } from "../lib/utils";
import { ProtocolErrorType } from "../lib/Errors/ProtocolErros";

export default function RedirectRoute(tempRegistry: Registry) {

    return async (req: Request , res: Response) => {

        let codeInfo: CodeInfoType = req.signedCookies["code"];

        if(!codeInfo) {
            return res.status(400).json({
                error:"invalid_request (no authorization code issued)"
            })
        }

        const user = await tempRegistry.get(req.signedCookies["sessionID"]);

        if(user.isWrong()) {
            return res.status(400).json({
                error:"user unauthenticated"
            })
        };

        const authorizationGranted = req.body.granted === 'true';

        if(!authorizationGranted) {
            return res.redirect(`${codeInfo.rediractionUri}/error=${ProtocolErrorType.accessDenied}`);
        }

        codeInfo.authorized = true;
        await tempRegistry.update(codeInfo.code , JSON.stringify(codeInfo));

        return res.redirect(`${codeInfo.rediractionUri}/code=${codeInfo.code}&state=${codeInfo.state}`);

    };

}