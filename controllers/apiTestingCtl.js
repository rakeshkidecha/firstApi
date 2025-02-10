const User = require('../models/UserModel');
const path = require('path');
const fs = require('fs');

module.exports.getData = async (req,res)=>{
    try {

        let search = '';
        let page = 0, perPage = 2;
        let sort,sortFeild;

        if(req.query.search){
            search = req.query.search;
        }

        if(req.query.page){
            page = req.query.page;
        }

        if(req.query.sort){
            sort = req.query.sort;
        }

        if(req.query.sortFeild){
            sortFeild = req.query.sortFeild;
        }

        const userData = await User.find({
            status:true,
            $or:[
                {username:{$regex:search,$options:'i'}},
                {email:{$regex:search,$options:'i'}},
                {gender:{$regex:search,$options:'i'}},
                {hobby:{$regex:search,$options:'i'}},
                {city:{$regex:search,$options:'i'}},
            ]
        }).sort({...(sort&&sortFeild&&{[sortFeild]:JSON.parse(sort)})}).skip(page*perPage).limit(perPage);

        const userActiveData = await User.find({
            status:true,
            $or:[
                {username:{$regex:search,$options:'i'}},
                {email:{$regex:search,$options:'i'}},
                {gender:{$regex:search,$options:'i'}},
                {hobby:{$regex:search,$options:'i'}},
                {city:{$regex:search,$options:'i'}},
            ]
        }).countDocuments();

        const totalPage = Math.ceil(userActiveData/perPage);
 
        const deactiveData = await User.find({status:false});

        return res.status(200).json({
            msg:"get data successfully",
            data:userData,
            deactiveData:deactiveData,
            ...(search&&{search}),
            totalPage,
            page,
            ...(sort&&{sort}),
            ...(sortFeild&&{sortFeild}),
        })
    } catch (err) {
        console.log(err)
        return res.status(400).json({msg:"Something Wrong",error:err});
    }
}

module.exports.addData = async (req,res)=>{
    try {

        let imagePath = '';
        if(req.file){
            imagePath = User.imgPath+'/'+req.file.filename;
        }
        req.body.image = imagePath;
        const addedData = await User.create(req.body);
        if(addedData){
            return res.status(200).json({msg:"Data Add successfully",data:addedData});
        }else{
            return res.status(400).json({msg:"Failed to add data"});
        }
    } catch (err) {
        return res.status(400).json({msg:"Something Wrong",err});
    }
}

module.exports.deleteData = async (req,res)=>{
    try {

        const isExistUser = await User.findById(req.params.id);
        if(isExistUser){
            try {
                let deleteImagePath = path.join(__dirname,'..',isExistUser.image);
                await fs.unlinkSync(deleteImagePath);
            } catch (err) {
                console.log("Image not Found")
            }

            const deleteData = await User.findByIdAndDelete(req.params.id);
            if(deleteData){
                return res.status(200).json({msg:"Data Delete successfully",data:deleteData});
            }else{
                return res.status(200).json({msg:"Failed to delete data or record not found"});
            }
        }else{
            return res.status(200).json({msg:"record not found"});
        }
        
    } catch (err) {
        return res.status(400).json({msg:"Something Wrong",err});
    }
}

module.exports.singleData = async(req,res)=>{
    try {
        const singleData = await User.findById(req.params.id);
        if(singleData){
            return res.status(200).json({msg:"Data Founded",data:singleData});
        }else{
            return res.status(200).json({msg:"Data not Found"});
        }
    } catch (err) {
        return res.status(400).json({msg:"Something Wrong",err});
    }
}

module.exports.updateData = async(req,res)=>{
    try {
        const isDataExist = await User.findById(req.params.id);
        if(isDataExist){
            if(req.file){
                // old image path delete 
                try {
                    const deleteImagePath = path.join(__dirname,'..',isDataExist.image);
                    await fs.unlinkSync(deleteImagePath);
                } catch (err) {
                    console.log("Image not Found")
                }

                // new image path add 
                req.body.image = User.imgPath+'/'+req.file.filename;

            }else{
                req.body.image = isDataExist.image;
            }

            const updatedData = await User.findByIdAndUpdate(req.params.id,req.body);
            if(updatedData){
                const newData = await User.findById(updatedData._id);
                return res.status(200).json({msg:"Data Updated successfully",data:newData});
            }else{
                return res.status(200).json({msg:"Failed to Update data"});
            }
        }else{
            return res.status(200).json({msg:"Data not Found"});
        }
    } catch (err) {
        return res.status(400).json({msg:"Something Wrong",err});
    }
}

module.exports.profile = async (req,res)=>{
    try {
        return res.status(200).json({msg:"Profile Founded",data:req.user});
    } catch (err) {
        return res.status(400).json({msg:"Something Wrong",err});
    }
};

module.exports.chnageStatus = async(req,res)=>{
    try {
        let {id,status} = req.query;
        status = JSON.parse(status);
        const isExistUser = await User.findById(id);
        if(isExistUser){    
            const updatedData = await User.findByIdAndUpdate(id,{status:!status});
            if(updatedData){
                return res.status(200).json({msg:"Status Updated"});
            }else{
                return res.status(200).json({msg:"Status not Updated"});
            }
        }else{
            return res.status(401).json({msg:"User not Found"});
        }
    } catch (err) {
        console.log(err)
        return res.status(400).json({msg:"Something Wrong",err});
    }
};

module.exports.deleteAll = async(req,res)=>{
    try {
        console.log(req.body)
        const deleteAll = await User.deleteMany({_id:{$in:req.body.userId}});
        if(deleteAll){
            return res.status(200).json({msg:"All Data Deleted"});
        }else{
            return res.status(200).json({msg:"Failed to Delete all data"});
        }
    } catch (err) {
        return res.status(400).json({msg:"Something Wrong",err});
    }
}