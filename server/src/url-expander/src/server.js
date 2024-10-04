import express from 'express'

const app = express()
const PORT = 3002

app.get('/', (req, res)=>{
    res.send("Hello expander");
})

app.listen(PORT)