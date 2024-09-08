const router =require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticateToken = require('./auth');

router.post('/sign-in',async (req,res)=>{
    try{
        const {first_name,last_name,email,password} = req.body

        const existingEmail = await User.findOne({email:email});
        if(existingEmail){
            return res.status(300).json({"message":"Email already exists"});
        }
        const hashPass = await bcrypt.hash(password,10);
        
        const newUser = new User({first_name:first_name,last_name:last_name,email:email,password:hashPass})
        await newUser.save();
        return res.status(200).json({"message":"Sign in successful"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({"message":"Internal Server Error"})
    }
});

router.post('/login',async (req,res)=>{
    try{
        const {email,password} = req.body;
        const existingUser = await User.findOne({email:email});
        if(!existingUser){
            return res.status(400).json({"message":"Invalid credentials"});
        }
        bcrypt.compare(password,existingUser.password,(err,data)=>{
            if(data){
                const authClaims = [{name:email},{jti:jwt.sign({},process.env.JWT_SECRET)}];
                const token = jwt.sign({authClaims},process.env.JWT_SECRET,{expiresIn:"2d"});
                return res.status(200).json({_id:existingUser._id,token:token});
            }
            else{
                return res.status(400).json({"message":"Invalid credentials"});
            }
        
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({"message":"Internal Server Error"})
    }
});

router.post('/profile',authenticateToken,async (req,res)=>{
    const userId = req.body.userId;
    try{
        const response = await User.findOne({_id:userId}).populate({path:'tasks'});
        return res.status(200).json({"name":response.first_name,"email":response.email,"tasks":response?.tasks?.length});
    }
    catch(err){
        return res.status(500).json({"message":"Internal Server Error"});
    }
})


module.exports=router;