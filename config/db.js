const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/apiTesting');

const db = mongoose.connection;

db.once('open',err=>console.log(err?err:"Db is connected"));

module.exports = db;