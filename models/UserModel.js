const mongoose = require('mongoose');

const path = require('path');
const multer = require('multer');
const imagePath = '/uploads/user';

const UserSchema = mongoose.Schema({
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
    gender:{
        type :String,
        required :true
    },
    hobby:{
        type :Array,
        required :true
    },
    city:{
        type :String,
        required :true
    },
    image:{
        type :String,
        required :true
    },
    status:{
        type:Boolean,
        default :true
    }
},{timestamps:true});

const imageStorage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname,'..',imagePath));
    },
    filename:(req,file,cb)=>{
        cb(null,file.fieldname+'-'+Date.now());
    }
});

UserSchema.statics.uploadImage = multer({storage:imageStorage}).single('image');
UserSchema.statics.imgPath = imagePath;

const User = mongoose.model('User',UserSchema);

module.exports = User;