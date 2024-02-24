const Job = require('../models/job-model');
const Application = require('../models/application-model')
const applicationCreateSchema = {
    jobId:{
        in:['params'],
        isMongoId:{
            errorMessage:"should be a valid mongodb object id"
        }
    },
    candidateId:{
        in:['body'],
        custom:{
            options :async(value , {req})=>{
                const application = await Application.findOne({candidateId:req.user.id,jobId:req.params.jobId})
                if(application){
                    throw new Error('you have already applied')
                }else{
                    return true
                }
            }
        }
    },
    coverLetter:{
        in:['body'],
        exists:{
            errorMessage:'cover letter is required'
        },
        notEmpty:{
            errorMessage:'cover letter should not be empty'
        },
        isLength:{
            options:{min:10,max:2000}
        }
    },
    applicationDate:{
        in:['body'],
        exists:{
            errorMessage:'cover letter is required'
        },
        notEmpty:{
            errorMessage:"application date should not be empty"
        },
        isDate:{
            errorMessage:"should be a valid date"
        },
        custom:{
            options:async function(value,{req}){
                const job = await Job.findById(req.params.jobId)
                if(new Date(value)<=job.deadline){
                    return true
                }else{
                    throw new Error('job has expired')
                }
            }
        }
    }
}
const applicationUpdateSchema={
    status:{
        isIn:{
            options:[['submitted','under-review','rejected','accepted']]
        }
    }
}


module.exports ={
    applicationCreateSchema,
    applicationUpdateSchema
}