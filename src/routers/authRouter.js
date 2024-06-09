const Router =  require('express')
const { resgiter, login, verification } = require('../controllers/userController')


const authRouter = Router()

authRouter.post('/regiter' , resgiter )
authRouter.post('/login' , login )
authRouter.post('/verification' , verification )

module.exports= authRouter