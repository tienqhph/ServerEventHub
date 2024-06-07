const Router =  require('express')
const { resgiter } = require('../controllers/userController')


const authRouter = Router()

authRouter.post('/regiter' , resgiter )

module.exports= authRouter