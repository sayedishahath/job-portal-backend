const Job = require('../models/job-model')
const Application = require('../models/application-model')
const {validationResult} = require('express-validator')
const jobCrtl ={}

jobCrtl.create = async(req,res)=>{
const errors= validationResult(req)
if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()})
}
const body = req.body
try{
    const job =new Job(body)
    job.recruiterId = req.user.id  //add recruiter id to the user who is logged in
    await job.save()
    res.json(job)
}catch(err){
    res.json(err)
}
}

jobCrtl.getAllJobs =async (req,res)=>{
    try{
        const jobs = await Job.find().sort({createdAt:-1})
        res.status(200).json(jobs)
    }catch(err){
        res.status(500).json({error:'internal server error'})
    }
}

jobCrtl.getMyJob = async(req,res)=>{
    try{
        const jobs = await Job.find({recruiterId : req.user.id}).sort({createdAt:-1})
        res.status(200).json(jobs)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'internal server error'})
    }
}

jobCrtl.updateJob =async(req,res)=>{
    const errors= validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const id=req.params.id
    const body =req.body
    try{
        const updatedJob = await Job.findOneAndUpdate({_id:id,recruiterId:req.user.id},body,{new:true})
        res.json(updatedJob)
    }catch(err){
        res.json(err)
    }
}

jobCrtl.deleteJob =async(req,res)=>{
    const id =req.params.id
    try{
        const deletedJob = await Job.findOneAndDelete({_id:id,recruiterId:req.user.id})
        res.json(deletedJob)
    }catch(err){
        res.json(err)
    }
}
jobCrtl.listApplications =  async(req,res)=>{
    try{
        const job = await Job.findOne({_id:req.params.id,recruiterId:req.user.id})
        if(!job){
            return res.status(400).json({error:'job not found'})
        }
        const  applications = await Application.find( {jobId: job._id})
        res.json(applications)
    }catch(err){
        res.json(err)
    }
}
jobCrtl.showApplication = async(req,res)=>{
    try{
        const application = await Application.findOne({jobId:req.params.jobId,_id:req.params.id,candidateId:req.user.id})
        res.json(application)
    }catch(err){
        res.json(err)
    }
}

module.exports = jobCrtl