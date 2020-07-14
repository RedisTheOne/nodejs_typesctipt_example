//Dependencies
import _, { Router, Request, Response } from 'express';
import path from 'path';
import multer from 'multer';
import { AuthenticatorRequest } from '../incFunctions';
import fs from 'fs';
import jwt from 'jsonwebtoken';

//Variables
const router = Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});
const upload = multer({ storage });

//Models
import Post, { IPost } from '../models/Post';
import Comment, { IComment } from '../models/Comment';

//Get Posts
router.get('/', async (req: Request, res: Response) => {
    const posts: Array<IPost> = await Post.find({}).sort({created_at: -1});
    const comments: Array<IComment> = await Comment.find({}).sort({created_at: -1});
    const data = posts.map((p: IPost) => {
        const postComments = comments.filter((c: IComment) => c.post_id == p._id);
        return {
            post: p,
            comments: postComments
        }
    });
    res.json({
        status: true,
        data
    });
});

//Add Post
router.post('/upload', AuthenticatorRequest, upload.single('avatar'), (req: Request, res: Response) => {
    jwt.verify(req.params.token, 'mykey', (err, authData) => {
        if(err) 
            res.json({
                status: false,
                msg: 'Error occured.'
            });
        else {
            const jwtData: any = authData;
            new Post({
                user_id: jwtData.user._id,
                title: req.body.title,
                description: req.body.description,
                image_name: req.file.filename
            }) 
                .save()
                .then((post: IPost) => res.json({
                    status: true,
                    msg: 'Post created successfully',
                    data: post
                }));
        }
    });
});

//Edit Post
router.put('/edit/:post_id', AuthenticatorRequest, (req: Request, res: Response) => {
    if(req.body.title && req.body.description) {
        jwt.verify(req.params.token, 'mykey', (err, authData: any) => {
            if(err)
                res.json({
                    status: false,
                    msg: 'Error occured.'
                });
            else {
                Post
                    .findOne({_id: req.params.post_id, user_id: authData.user._id})
                    .then((post: IPost | null) => {
                        if(post) {
                            Post
                                .updateOne({_id: post._id}, {title: req.body.title, description: req.body.description})
                                .then(() => res.json({
                                    status: true,
                                    msg: 'Post updated successfully.'
                                }));
                        } else 
                            res.sendStatus(403);
                    });
            }
        });
    } else
        res.json({
            status: false,
            msg: 'Please fill required fields.'
        });
});

//Delete Post
router.delete('/delete/:post_id',  AuthenticatorRequest, (req: Request, res: Response) => {
    jwt.verify(req.params.token, 'mykey', (err, authData: any) => {
        if(err)
            res.json({
                status: false,
                msg: 'Error occured.'
            });
        else {
            Post
                .findOne({_id: req.params.post_id, user_id: authData.user._id})
                .then((post: IPost | null) => {
                    if(post) {
                        fs.unlink(`uploads/${post.image_name}`, () => {
                            Comment
                                .deleteMany({post_id: post._id})
                                .then(() => {
                                    Post
                                        .deleteOne({_id: post._id})
                                        .then(() => res.json({
                                            status: true,
                                            msg: 'Post deleted successfully'
                                        })); 
                                });
                        });
                    } else
                        res.sendStatus(403);
                });
        }
    });
});

export default router;