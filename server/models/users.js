const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    userImage : {
        type : String,
        default : 'https://res.cloudinary.com/vipul17/image/upload/v1626587548/profileImage_qr0ruc.png'
    },
    followers:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
});

const Users = mongoose.model('User',userSchema);
module.exports = Users;