const { Schema,model} = require("mongoose")
const jobScehma = new Schema({
    title:String,
    description:String,
    requiredSkills:[String],
    location:String,
    salaryRange:{
        min:Number,
        max:Number
    },
    recruiterId:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    deadline:Date
},{timestamps:true})

const Job = model('Job',jobScehma)
module.exports = Job
