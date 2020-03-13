const bcrypt = require("bcryptjs");
const Chat = require("./schema/chat");

const dbUrl = "mongodb+srv://phuchptty:hphuk123@realtimechatapp-0kqjw.gcp.mongodb.net/rtca?retryWrites=true&w=majority";
var mongoose = require('mongoose');
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

let userData = [
    {
        sender: '5e5a59d71c9d440000bc2820',
        message: 'abcflnfle',
        reciver: {
            user: '5e5b767f357fa0095c39fbfb',
            delivered: true,
            read: false,
            last_seen: 1583080603000
        }
    },{
        sender: '5e5a59d71c9d440000bc2820',
        message: 'bcdalkdamwdw',
        reciver: {
            user: '5e5b767f357fa0095c39fbfb',
            delivered: true,
            read: false,
            last_seen: 1583080609000
        }
    },{
        sender: '5e5b767f357fa0095c39fbfb',
        message: 'xyădkwdalwnlz',
        reciver: {
            user: '5e5a59d71c9d440000bc2820',
            delivered: true,
            read: false,
            last_seen: 1583080610000
        }
    }
]


Chat.create(userData, function (err, user) {
    if (err) {
        console.error(err)
    } else {
        console.info("Thành Công");
    }
});