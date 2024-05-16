

const express = require('express')

const cors = require('cors')
const app = express()
app.use(cors())
const PORT = 3001


app.get('/auth/hello' , (req , res)=>{
    res.send('<h1>Hello</h1>')
})


app.listen(PORT , ()=>{
    console.log(`Server stating at http://localhost:${PORT}`);
})