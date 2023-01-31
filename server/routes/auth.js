const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Users = require('../models/users');
const jwt = require('jsonwebtoken');
const {SECRET_KEY} = require('../config')
const verifyUser = require('../middleware/verifyUser');
const router = express.Router()

router.get('/',(req,res)=>{
    res.send('Hello Route')
})

router.get('/protected',verifyUser,(req,res)=>{
    res.send('This is protected')
})

router.post('/signup',(req,res,next)=>{

    const {name, email, password, userImage} = req.body;
    if(!name || !email || !password){
        res.status = 422;
        res.setHeader('Content-Type', 'application/json');
        res.json({error : "Please fill all details"});
        return;
    }
    else{
        Users.findOne({email : email})
        .then(user => {
            if(!user){
                bcrypt.hash(password,12)
                    .then(hashPassword =>{
                        const user = new Users({
                            name,
                            email,
                            password : hashPassword,
                            userImage
                        })
                        user.save()
                        .then(user => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json({message : "Sign up Successfully!"});
                            
                        })
                        .catch(err => console.log(err));
                    })
            }
            else{
                res.statusCode = 422;
                res.setHeader('Content-Type', 'application/json');
                res.json({error : "User already exists"});
            }
        })
        .catch(err => console.log(err));
    }
})

router.post('/login',(req,res)=>{
    const {email, password} = req.body;
    if(!email || !password){
        res.statusCode = 422;
        res.setHeader('Content-Type','application/json');
         res.json({error : 'Please fill all details'});
    }
    else{
        Users.findOne({email : email})
        .then(user => {
            if(!user){
                res.statusCode = 401;
                res.setHeader('Content-Type', 'application/json');
                return res.json({error : "Login failed!"});
            }
            else{
                bcrypt.compare(password,user.password)
                .then(match=>{
                    if(match){
                        // generating JWT token
                    
                        const token = jwt.sign({_id:user._id},SECRET_KEY);
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({token : token,user});
                        
                        // res.json({message : "Login successfully!"});
                    }
                    else{
                        res.statusCode = 401;
                        res.setHeader('Content-Type', 'application/json');
                        return res.json({error : "Login failed!"});
                    }
                })
                .catch(err => console.log(err));
                
            }
        })    
    }
})

module.exports = router;