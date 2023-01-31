const jwt = require('jsonwebtoken')
const {SECRET_KEY} = require('../config');
const mongoose = require('mongoose');
const Users = require('../models/users')

module.exports = (req,res,next) => {
    const {authorization} = req.headers

    if(!authorization){
        res.statusCode  = 401;
        return res.json({error : "you must logged in"})
    }

    const token = authorization.replace("Bearer ","")
    jwt.verify(token,SECRET_KEY,(err,payload)=>{
        if(err){
            res.statusCode  = 401;
            return res.json({error : "you must logged in"})
        }

        const {_id} = payload;
        Users.findById(_id)
        .then(userData => {
            req.user = userData;
            next();
        })
        
    })
}