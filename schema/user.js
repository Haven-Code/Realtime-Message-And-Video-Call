var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    fullname : {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    friends: {
        type: Array,
        required: false,
        ref: 'users'
    },
    is_online: {
        type: Boolean
    },
    last_online: {
        type: Date
    }
},{
    timestamps: true
});
var User = mongoose.model('users', UserSchema);
module.exports = User;