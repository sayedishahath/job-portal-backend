require('dotenv').config()
const express = require ('express')
const cors = require ('cors')
const app = express()
const port =3055
const {checkSchema} = require('express-validator')
const {registerValidationSchema,loginValidationSchema} = require('./app/validations/user-validator')
const jobValidationSchema = require('./app/validations/job-validator')
const {applicationCreateSchema, applicationUpdateSchema} = require('./app/validations/application-validator')


const userCtrl = require('./app/controllers/user-controller')
const jobCrtl =require('./app/controllers/job-controller')
const applicationCrtl =require('./app/controllers/application-controller')

const {authenticateUser,authorizeUser} = require('./app/middlewares/auth')
const configureDb = require('./config/db')
const roles = require('./utils/roles')


configureDb()
app.use(express.json())
app.use(cors())

app.post('/api/user/register', checkSchema(registerValidationSchema), userCtrl.register)
app.post('/api/user/login',checkSchema(loginValidationSchema),userCtrl.login)
app.get('/api/user/account',authenticateUser,userCtrl.account)


app.get('/api/jobs',jobCrtl.getAllJobs)
app.get('/api/jobs/my',authenticateUser, authorizeUser([roles.recruiter]),jobCrtl.getMyJob)
app.put('/api/jobs/update/:id',authenticateUser,authorizeUser([roles.recruiter]),checkSchema(jobValidationSchema),jobCrtl.updateJob)
app.delete('/api/jobs/delete/:id',authenticateUser,authorizeUser([roles.recruiter]),jobCrtl.deleteJob)
app.post('/api/jobs/create', authenticateUser,authorizeUser([roles.recruiter]),checkSchema(jobValidationSchema),jobCrtl.create)

app.get('/api/jobs/:id/applications', authenticateUser, authorizeUser([roles.recruiter]), jobCrtl.listApplications)
app.post('/api/jobs/:jobId/apply', authenticateUser,authorizeUser([roles.candidate]),checkSchema(applicationCreateSchema),applicationCrtl.apply)
app.put('/api/applications/:id/job/:jobId', authenticateUser, authorizeUser([roles.recruiter]),checkSchema(applicationUpdateSchema), applicationCrtl.update)
app.delete('/api/applications/:id', authenticateUser, authorizeUser([roles.candidate]), applicationCrtl.delete)
app.get('/api/jobs/:jobId/applications/:id', authenticateUser, authorizeUser([roles.recruiter, roles.candidate]), jobCrtl.showApplication)



app.get('/verify/:token', userCtrl.verifyEmail)

app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})