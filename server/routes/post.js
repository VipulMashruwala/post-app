const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Posts = require('../models/post')
const Users = require('../models/users')
const verifyUser = require('../middleware/verifyUser')

router.get('/posts', verifyUser, (req, res, next) => {
    Posts.find({})
        .populate('postBy', "_id name") /// mongoose population
        .populate('comments.postedBy', '_id name')
        .then(posts => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(posts)
        })
        .catch(err => console.log(err))
})

router.post('/addpost', verifyUser, (req, res, next) => {
    console.log(req.body);
    const { title, body, image } = req.body;
    if (!title || !body || !image) {
        res.statusCode = 422;
        res.json({ error: "Please add all details" });
        return;
    }
    else {
        req.user.password = undefined;
        const post = new Posts({
            title,
            body,
            image: image,
            postBy: req.user
        })
        post.save()
            .then(post => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(post)
            })
            .catch(err => console.log(err))
    }
})

router.get('/myposts', verifyUser, (req, res, next) => {
    Users.findOne({ _id: req.user._id })
        .select('-password')
        .then(user => {
            Posts.find({ postBy: req.user._id })
                .populate('postBy', "_id name") /// mongoose populationy
                .populate('comments.postedBy', '_id name')
                .then(myposts => {
                    // console.log(myposts)
                    if (!myposts.length) {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({ user,message: "No post yet" })
                    }
                    else {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({user,myposts});
                    }
                })
                .catch(err => console.log(err));
        })
    })

    // Users.findOne({_id : req.user._id})
    //         .select('-password')
    //         .then(user => {
    //             Posts.find({postBy: req.user._id})
    //             .populate('postBy',"_id name") /// mongoose populationy
    //             .populate('comments.postedBy','_id name')
    //             .exec((err,posts)=>{
    //                 if(err){
    //                     return res.status(422).json({error: err})
    //                 }
    //                 res.json({user,posts})
    //             })
    //         }).catch(err => {
    //             return res.status(404).json({error: 'User not Found'})
    //         })

    router.put('/like', verifyUser, (req, res) => {
        Posts.findByIdAndUpdate(req.body.postId, {
            $push: { likes: req.user._id }
        }, {
            new: true
        })
            .populate('postBy', "_id name") /// mongoose populationy
            .populate('comments.postedBy', '_id name')
            .exec((err, result) => {
                if (err) {
                    return res.status(422).json({ error: err });
                }
                else {
                    res.json(result)
                }
            })
    })

    router.put('/unlike', verifyUser, (req, res) => {
        Posts.findByIdAndUpdate(req.body.postId, {
            $pull: { likes: req.user._id }
        }, {
            new: true
        })
            .populate('postBy', "_id name") /// mongoose populationy
            .populate('comments.postedBy', '_id name')
            .exec((err, result) => {
                if (err) {
                    return res.status(422).json({ error: err });
                }
                else {
                    res.json(result)
                }
            })
    })

    router.put('/comment', verifyUser, (req, res) => {

        const comment = {
            text: req.body.text,
            postedBy: req.user._id
        }
        console.log(comment)

        Posts.findByIdAndUpdate(req.body.postId, {
            $push: { comments: comment }
        }, {
            new: true
        })
            .populate('postBy', "_id name") /// mongoose populationy
            .populate('comments.postedBy', '_id name')
            .exec((err, result) => {
                if (err) {
                    return res.status(422).json({ error: err });
                }
                else {
                    res.json(result)
                }
            })
    })

    router.delete('/deletepost', verifyUser, (req, res) => {
        // console.log(req.body)
        Posts.findById(req.body.postId)

            .then(post => {
                // console.log(post)

                if (post.postBy.equals(req.user._id)) {
                    // console.log('POST DELETE')
                    Posts.findByIdAndRemove(req.body.postId)
                        .populate('postBy', "_id name") /// mongoose populationy
                        .populate('comments.postedBy', '_id name')
                        .then(post => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json({ post, message: "Post Deleted Successfully!!" })
                        })
                }
            })
    });

    module.exports = router;