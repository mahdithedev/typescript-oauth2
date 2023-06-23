import { Request, Response } from "express";
import { v4 } from "uuid";
import Registry from "../lib/TemporaryRegistry/registry";


export default function AuthenticateRoute(TempRegistry: Registry) {
    
    return async (req: Request , res: Response) => {

        if(!req.cookies["sessionID"]) {
            const sessionID = v4();
            TempRegistry.set(sessionID , JSON.stringify({sessionID}));
            res.cookie("sessionID", sessionID , {httpOnly:true , signed:true});
        }

        return res.json({
            ok:true
        });

    };
};  