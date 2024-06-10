const Router =  require('express')
const { resgiter, login, verification, resetPassword, updateNewPassWord } = require('../controllers/userController')


const authRouter = Router()

authRouter.post('/regiter' , resgiter )
authRouter.post('/login' , login )
authRouter.post('/verification' , verification )
authRouter.post('/resetpass' , resetPassword )
authRouter.put('/updatepass/:id' , updateNewPassWord )

module.exports= authRouter