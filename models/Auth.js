const mongoose = require('mongoose');

const AuthSchema = mongoose.Schema({
    username : {
        type :String,
        required :true
    },
    email : {
        type :String,
        required :true
    },
    password : {
        type :String,
        required :true
    },
})

const Auth = mongoose.model('Auth',AuthSchema);

module.exports = Auth;