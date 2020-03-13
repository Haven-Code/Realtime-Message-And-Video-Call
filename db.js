const dbUrl = "mongodb+srv://phuchptty:hphuk123@realtimechatapp-0kqjw.gcp.mongodb.net/rtca?retryWrites=true&w=majority";
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.Promise = global.Promise;

const db = mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

exports.dbUrl = dbUrl;
exports.dbConnect = db;