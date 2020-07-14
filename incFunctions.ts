import _, {  Request, Response, NextFunction } from 'express';

export function AuthenticatorRequest(req: Request, res: Response, next: NextFunction) {
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined') {
        req.params.token = bearerHeader.split("Bearer ")[1];
        next();
    } else
        res.sendStatus(403);
}