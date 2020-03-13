var mongoose = require('mongoose');
const ChatSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    
    message: String,

    is_group_message: { 
        type: Boolean, 
        default: false 
    },

    group_id: String,

    reciver: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users'
            },
            delivered: Boolean,
            read: Boolean,
            last_seen: Date
        }
    ]
},{
    timestamps: true
});

var Chat = mongoose.model('message', ChatSchema);
module.exports = Chat;