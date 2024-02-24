const _ = require("lodash")
const jwt = require('jsonwebtoken')
const transporter = require('../../config/nodemailer')
const User = require('../models/user-model')
const {validationResult} = require('express-validator')
const bcrypt = require('bcryptjs')
const userCtrl={}

userCtrl.register = async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({error: errors.array()})
    }
    const body =req.body
    const user = new User(body)

    const verificationToken = Math.random().toString(36).slice(2);

    const mailOptions = {
        from: process.env.EMAIL,
        to: user.email,
        subject: 'Verify Your Email',
        text: `Click the following link to verify your email: http://localhost:3055/verify/${verificationToken}`
    }
    try{
        const salt = await bcrypt.genSalt()
        const encryptedPassword = await bcrypt.hash(user.password,salt)
        user.password=encryptedPassword
        user.verificationToken=verificationToken
        // await user.save()
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error)
                return res.status(500).send('Error sending verification email')
            } else {
                console.log('Email sent: ' + info.response)
                user.save()
                // return res.status(200).send('Verification email sent');
                res.status(201).json([{data:_.omit(user.toJSON(),['password']),message:'email verification sent'}])
            }
        })
        
    }catch(err){
        res.status(500).json({error:'internal server error'})
    }
}

userCtrl.verifyEmail = async(req,res)=>{
    const token = req.params.token
    try{
        const user=await (User.findOneAndUpdate({verificationToken:token},{isVerified:true,verificationToken:null},{new:true}).select({password:0}))
        if(!user){
            return res.status(404).json('email already verified')
        }
        res.json(`email is verified ${user}`)
    }catch(err){
        res.status(500).json({error:'internal server error'})
    }
}

userCtrl.login  =async (req,res)=> {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    try{
        const body = req.body
        let user = await User.findOne({email:body.email})
        
        if(!user){
            return res.status(404).json({error:"invalid email/password"})
        }
        const checkPassword = await bcrypt.compare(body.password,user.password)
        if (!checkPassword){
            return res.status(404).json({error:'invalid email/password'})
        }
        // if(!user.isVerified){
        //     return res.status(400).json({error:'user is not verified'})
        // }
        const tokenData={
            id : user._id, 
            role:user.role
        }
        const token = jwt.sign(tokenData,process.env.JWT_SECRET,{expiresIn:'7d'})
        user =await User.findOneAndUpdate({email:body.email},{jwtToken:token},{new:true})
        
        res.json({token:token , data:user })
    }catch(err){
        // console.log('Error in login', err);
        res.status(500).json({error:'internal server error'})
    } 
}



userCtrl.account =async (req,res)=>{
    try{
        const user = await(User.findById(req.user.id).select({password:0}))
        if(user.isVerified){
            return res.status(200).json(user)
        }else{
            return res.status(400).json({error:'user is not verified'})
        }
        
    }catch(err){
        res.status(500).json({error:"internal server error"})
    }
}

module.exports = userCtrl