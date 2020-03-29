const dbUrl = "mongodb+srv://user:password@host/dbname?retryWrites=true&w=majority";
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.Promise = global.Promise;

const db = mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

exports.dbUrl = dbUrl;
exports.dbConnect = db;
