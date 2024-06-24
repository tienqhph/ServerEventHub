const Router =  require('express')
const { resgiter, login, verification, resetPassword, updateNewPassWord, hanldeLoginWithGoogle, handleLoginWithFaceBook, getAllUser } = require('../controllers/userController')
const verifiTocken = require('../../middleware/verifiMidleware')


const authRouter = Router()
authRouter.get('/getalluser' ,verifiTocken, getAllUser)
authRouter.post('/regiter' , resgiter )
authRouter.post('/login' , login )
authRouter.post('/verification' , verification )
authRouter.post('/resetpass' , resetPassword )
authRouter.put('/updatepass/:id' , updateNewPassWord )
authRouter.post('/signinwithgoogle' , hanldeLoginWithGoogle )
authRouter.post('/signinwithfacebook' , handleLoginWithFaceBook)
module.exports= authRouter