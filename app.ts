//Dependencies
import express, { Application, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

//Application
const app: Application = express();

//MiddleWares
app.use(express.urlencoded({ extended: true }));
app.use((req: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header('Access-Control-Allow-Methods', 'PUT, POST');
    next();
});
app.use(express.json());

//Database Connection 
mongoose
    .connect("mongodb+srv://redus:redis06122002!@cluster0-xwsm9.mongodb.net/juthapp?retryWrites=true&w=majority", {  useNewUrlParser: true, useUnifiedTopology: true  })
    .then(() => {console.log("Connected to MongoDB")});

//Routers
import Users from './routes/users';
import Posts from './routes/posts';
import Comments from './routes/comments';

//Routes
app.use('/users', Users);
app.use('/posts', Posts);
app.use('/comments', Comments);

//Listen
app.listen(5000, () => console.log('Server Started'));