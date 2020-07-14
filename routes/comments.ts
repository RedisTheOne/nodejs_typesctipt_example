//Dependencies
import _, { Router, Request, Response } from 'express';
import { AuthenticatorRequest } from '../incFunctions';
import jwt from 'jsonwebtoken';

//Variables
const router = Router();

//Models
import Comment, { IComment } from '../models/Comment';

//Add Comment
router.post('/add', AuthenticatorRequest, (req: Request, res: Response) => {
    if(req.body.comment && req.body.post_id) {
        jwt.verify(req.params.token, 'mykey', (err, authData: any) => {
            if(err)
                res.json({
                    status: false,
                    msg: 'Error occured.'
                });
            else {
                new Comment({
                    user_id: authData.user._id,
                    post_id: req.body.post_id,
                    comment: req.body.comment,
                    username: authData.user.username
                })
                    .save()
                    .then((comment: IComment) => res.json({
                        status: true,
                        msg: 'Comment added successfully.',
                        data: comment
                    }));
            }
        });
    } else 
        res.json({
            status: false,
            msg: 'Please fill required fields.'
        });
});

//Edit Comment
router.put('/edit/:comment_id', AuthenticatorRequest, (req: Request, res: Response) => {
    if(req.body.comment) {
        jwt.verify(req.params.token, 'mykey', (err, authData: any) => {
            if(err)
                res.json({
                    status: false,
                    msg: 'Error occured.'
                });
            else {
                Comment
                    .findOne({ _id: req.params.comment_id, user_id: authData.user._id })
                    .then((comment: IComment | null) => {
                        if(comment) {
                            Comment
                                .updateOne({ _id: comment._id }, { comment: req.body.comment })
                                .then(() => res.json({
                                    status: true,
                                    msg: 'Comment updated successfully.'
                                }));
                        } else
                            res.sendStatus(403);
                    })
                    .catch(() => res.sendStatus(403));
            }
        });
    } else
        res.json({
            status: false,
            msg: 'Please fill required fields.',
        });
});

//Delete Comment
router.delete('/delete/:comment_id', AuthenticatorRequest, (req: Request, res: Response) => {
    if(req.body.comment) {
        jwt.verify(req.params.token, 'mykey', (err, authData: any) => {
            if(err)
                res.json({
                    status: false,
                    msg: 'Error occured.'
                });
            else {
                Comment
                    .findOne({ _id: req.params.comment_id, user_id: authData.user._id })
                    .then((comment: IComment | null) => {
                        if(comment) {
                            Comment
                                .deleteOne({ _id: comment._id })
                                .then(() => res.json({
                                    status: true,
                                    msg: 'Comment deleted successfully.'
                                }));
                        } else
                            res.sendStatus(403);
                    })
                    .catch(() => res.sendStatus(403));
            }
        });
    } else
        res.json({
            status: false,
            msg: 'Please fill required fields.',
        });
});

export default router;