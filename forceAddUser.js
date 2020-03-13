const bcrypt = require("bcryptjs");
const User = require("./schema/user");

const dbUrl = "mongodb+srv://phuchptty:hphuk123@realtimechatapp-0kqjw.gcp.mongodb.net/rtca?retryWrites=true&w=majority";
var mongoose = require('mongoose');
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

bcrypt.hash('hphuk123', 15, function (err, hash) {
    var userData = {
        username: "phuc_phuong_hoang",
        password: hash,
        is_online: true,
        friends: ['5e5b767f357fa0095c39fbfb','5e5a59d71c9d440000bc2820']
    }

    console.log(userData);

    //use schema.create to insert data into the db
    User.create(userData, function (err, user) {
        if (err) {
            console.error(err)
        } else {
            console.info("Thành Công");
        }
    });
});