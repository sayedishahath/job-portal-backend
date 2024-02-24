const {Schema,model} = require('mongoose')
const userSchema = new Schema({
    userName:String,
    email:String,
    password:String,
    role:String,
    verificationToken:String,
    jwtToken:{
        type:String,
        default:null
    },
    isVerified:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

const User = model('User',userSchema)
module.exports = User
