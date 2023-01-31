const express = require('express');
const mongoose = require('mongoose');
const Users = require('./models/users')
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const app = express();

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/insta', 
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true
    })
    .then(()=>{
        console.log('Connected correctly to server')
    })
    .catch(err => console.Console.log(err));

app.use(authRouter);
app.use(postRouter);
app.use(userRouter);

const port = 5000;
app.listen(port,()=>{
    console.log(`server running at port http://localhost:${port}`);
})