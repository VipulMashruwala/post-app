const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments:[{
        text: String,
        postedBy : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User' 
        }
    }],
    postBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

const Posts = mongoose.model('Post',postSchema);
module.exports = Posts;