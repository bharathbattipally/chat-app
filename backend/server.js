import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import connectToMongoDB from './db/connectToMongoDB.js';

import authRoutes from './routes/auth.routes.js';
import messageRoutes from './routes/message.routes.js';
import userRoutes from './routes/user.routes.js'

dotenv.config();

const app=express();
const PORT= process.env.PORT || 9000;

/*app.get('/',(req,res)=>{
    res.send('Hello world');
})*/


app.use(bodyParser.json());
app.use(express.json()); // used to parse the request  body with json payloads and send it to the server
app.use(cookieParser());


app.use('/api/auth',authRoutes); //using middleware
app.use('/api/messages',messageRoutes);
app.use('/api/users',userRoutes);

app.listen(PORT,()=>{
    connectToMongoDB();
    console.log(`server running on port ${PORT}`);
})

