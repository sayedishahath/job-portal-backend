const Job =require('../models/job-model')
const jobValidationSchema={
    title:{
        notEmpty:{
            errorMessage:"title is required"
        }
    },
    description:{
        notEmpty:{
            errorMessage:"description is required"
        }
    },
    requiredSkills:{
        isArray:{
            options: {min:1},//at least one skill should be selected
            errorMessage:"At least one skill is required"
        },
        custom:{
            options:((value) => {
                if(value.every((item) => typeof item === 'string')){
                    return true
                }
                else{
                    throw new Error('invalid type of skill')
                }
            })
        }

    },
    location:{
        notEmpty:{
            errorMessage:"location is required"
        }
    },
    
    "salaryRange.min":{
        notEmpty:{
            errorMessage:"minimum salary is required"
        },
        isNumeric:{
            errorMessage:'Salary range must be a number'
        },
    },
    "salaryRange.max":{
        notEmpty:{
            errorMessage:"maximum salary is required"
        },
        isNumeric:{
            errorMessage:'Salary range must be a number'
        },
        custom:{
            options:((value,{req})=>{
                if(value<req.body.salaryRange.min){
                    throw new Error('max value should be greater than min')
                }
                else{
                    return true
                }
            })
        }
    },
    
    deadline:{
        notEmpty:{
            errorMessage:'dealine is required'
        },
        custom:{
            options: function(value){
                const inputDate = new Date(value);
                const today = new Date();
                // Check if the input date is greater than today
                if (inputDate <=today) {
                    throw new Error('Date should not be less than today or same day of job posting')
                }
                return true
            }
        }
    }
}
module.exports = jobValidationSchema