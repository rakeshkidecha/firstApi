const Auth = require('../models/Auth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.signUp = async(req,res)=>{
    try {
        const isExistEmail = await Auth.find({email:req.body.email}).countDocuments();
        
        if(isExistEmail != 0 ){
            return res.status(200).json({msg:"This Email Is already Exist"});
        }

        if(req.body.password != req.body.confirmPassword){
            return res.status(200).json({msg:"Password and Confirm Password are not same"});
        }

        req.body.password = await bcrypt.hash(req.body.password,10);

        const addedAuth = await Auth.create(req.body);

        if(addedAuth){
            return res.status(200).json({msg:"Auth added successfully",data:addedAuth});
        }else{
            return res.status(200).json({nsg:"Failed to add data"});
        }

    } catch (err) {
        return res.status(400).json({msg:"Something Wrong",err:err});
    }
}

module.exports.login = async(req,res)=>{
    try {
        const isExistEmail = await Auth.findOne({email:req.body.email});
        if(!isExistEmail){
            return res.status(200).json({msg:"Invalid Email"});
        }

        if(!await bcrypt.compare(req.body.password,isExistEmail.password)){
            return res.status(200).json({msg:"Invalid Password"});
        }

        const token = await jwt.sign({userData:isExistEmail},"mySecretKey");

        return res.status(200).json({msg:"Login Successfully",token:token});
        
    } catch (err) {
        return res.status(400).json({msg:"Something Wrong",err:err});
    }
}