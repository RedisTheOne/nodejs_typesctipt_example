//Dependencies
import _, { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatorRequest } from '../incFunctions';

//Models
import User, { IUser } from '../models/User';

//Router
const router: Router = Router();

//Log In
router.post('/login', (req: Request, res: Response) => {
    if(req.body.username && req.body.password) {
        User
            .findOne({username: req.body.username, password: req.body.password})
            .then((user: IUser | null) => {
                if(user) {
                    jwt.sign({user}, 'mykey', {expiresIn: '1d'}, (err, token) => {
                        if(err)
                            res.json({
                                status: false,
                                msg: 'Error occured.'
                            });
                        else
                            res.json({
                                status: true,
                                msg: `Welcom back ${req.body.username}!`,
                                token
                            });
                    });
                } else
                    res.json({
                        status: false,
                        msg: 'User is not valid'
                    });
            });
    } else 
        res.json({
            status: false,
            msg: 'Please fill required fields.'
        });
});

//Create Account
router.post('/signup', (req: Request, res: Response) => {
    if(req.body.username && req.body.password && req.body.email) {
        User
            .findOne({username: req.body.username})
            .then((user: IUser | null) => {
                if(user) 
                    res.json({
                        status: false,
                        msg: 'Username is already taken'
                    });
                else {
                    new User({
                        username: req.body.username,
                        password: req.body.password,
                        email: req.body.email
                    })
                        .save()
                        .then((user: IUser | null) => {
                            jwt.sign({user}, 'mykey', {expiresIn: '1d'}, (err, token) => {
                                if(err)
                                    res.json({
                                        status: false,
                                        msg: 'Error occured.'
                                    });
                                else
                                    res.json({
                                        status: true,
                                        msg: `Account created successfully!`,
                                        token
                                });
                            });
                        })
                        .catch(() =>  res.json({
                            status: false,
                            msg: 'Error occured.'
                        }));
                }
            });
    } else
        res.json({
            status: false,
            msg: 'Please fill required fields.'
        });
});

export default router;