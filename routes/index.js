const express = require('express');
const router = express.Router();
const apiTestingCtl = require('../controllers/apiTestingCtl');
const passport = require('passport');
const User = require('../models/UserModel');

router.use('/auth',require('./authRoutes'));

router.get('/',passport.authenticate('jwt',{failureRedirect:'/unauth'}),apiTestingCtl.getData);

router.get('/unauth',async (req,res)=>{
    return res.json({msg:"You Are Unathorized, Please Login First"});
});

router.post('/addData',passport.authenticate('jwt',{failureRedirect:'/unauth'}),User.uploadImage,apiTestingCtl.addData);

router.delete('/deleteData/:id',passport.authenticate('jwt',{failureRedirect:'/unauth'}),apiTestingCtl.deleteData);

router.get('/singleData/:id',passport.authenticate('jwt',{failureRedirect:'/unauth'}),apiTestingCtl.singleData);

router.patch('/updateData/:id',passport.authenticate('jwt',{failureRedirect:'/unauth'}),User.uploadImage,apiTestingCtl.updateData);

router.get('/profile',passport.authenticate('jwt',{failureRedirect:'/unauth'}),apiTestingCtl.profile);

module.exports = router;