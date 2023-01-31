const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Posts = require('../models/post')
const Users = require('../models/users')
const verifyUser = require('../middleware/verifyUser')

router.get('/user/:userID',verifyUser,(req,res)=>{
    Users.findOne({_id : req.params.userID})
        .select('-password')
        .then(user => {
            Posts.find({postBy: req.params.userID})
            .populate('postBy','_id name')
            .exec((err,posts)=>{
                if(err){
                    return res.status(422).json({error: err})
                }
                res.json({user,posts})
            })
        }).catch(err => {
            return res.status(404).json({error: 'User not Found'})
        })
})

router.put('/follow',verifyUser,(req,res)=>{
    Users.findByIdAndUpdate(req.body.followId,{
            $push : {followers : req.user._id}
        },{
            new: true
        },(err, result)=>{
            if(err){
                return res.status(422).json({error: err})
            }
            Users.findByIdAndUpdate(req.user._id,{
                $push: {following: req.body.followId}
            },{
                new: true
            }).select('-password').then(result => res.json(result))
                .catch(err => {
                    return res.status(422).json({error: err})
                })
        }
    )   
})

router.put('/unfollow',verifyUser,(req,res)=>{
    Users.findByIdAndUpdate(req.body.unfollowId,{
            $pull : {followers : req.user._id}
        },{
            new: true
        },(err, result)=>{
            if(err){
                return res.status(422).json({error: err})
            }
            Users.findByIdAndUpdate(req.user._id,{
                $pull: {following: req.body.unfollowId}
            },{
                new: true
            }).select('-password').then(result => res.json(result))
                .catch(err => {
                    return res.status(422).json({error: err})
                })
        }
    )   
})

router.put('/updateimage',verifyUser,(req,res)=>{
    console.log(req.body)
    Users.findByIdAndUpdate(req.user._id,{
        $set : {userImage : req.body.userImage}
    },{
        new: true
    })
    .then(user => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(user);
    })
    .catch(err => console.log(err))
})

module.exports = router;