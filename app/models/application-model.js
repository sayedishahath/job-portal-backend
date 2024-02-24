const {Schema,model} =  require('mongoose')
const applicationSchema ={
    jobId:{
        type: Schema.Types.ObjectId,
        ref:'Job'
    },
    candidateId:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    status :{
        type:String,
        default:'submitted'
    },
    coverLetter:String,
    applicationDate:Date,
    additionalInfo:String
}
const Application =  model('Application',applicationSchema)
module.exports= Application