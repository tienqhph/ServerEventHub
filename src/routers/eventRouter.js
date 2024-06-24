const Router = require('express')
const { addNewEvent } = require('../controllers/eventController')

const eventRouter = Router()

eventRouter.post('/addevent' , addNewEvent)
module.exports = eventRouter