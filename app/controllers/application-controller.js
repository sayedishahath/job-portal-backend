const Application = require('../models/application-model')
const Job = require('../models/job-model')
const _ = require('lodash')
const {validationResult} = require('express-validator')
const applicationCrtl ={}

applicationCrtl.apply = async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const body = _.pick(req.body ,['coverLetter','additionalInfo','applicationDate'])
    console.log(body)

    try{
        const application = await  Application.create({...body,candidateId:req.user.id,jobId:req.params.jobId})
        res.status(200).json(application)
    }catch(err){
        res.status(501).json({error:'internal server error'})
    }
}

applicationCrtl.update = async(req,res)=>{
    const id = req.params.id
    const errors= validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const body = _.pick(req.body,['status'])
    try{
        const job = await Job.findOne({_id:req.params.jobId,recruiterId:req.user.id})
        if(!job){
            return res.status(400).json({error:"job not found"})
        }
        const updateApplication = await Application.findByIdAndUpdate(id,body,{new:true})
        res.status(201).json(updateApplication)
    }catch(err){
        res.json(err)
    }
}
applicationCrtl.delete= async(req,res)=>{
    const id = req.params.id
    try{
        const application = await Application.findOneAndDelete({candidateId:req.user.id,_id:id,status:'submitted'})
        res.json(application)
    }catch(err){
        res.json(err)
    }
}


module.exports = applicationCrtl