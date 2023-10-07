const express = require("express")
const cors = require("cors")
const fs = require("fs")

const app = express()

app.use(cors())
app.use(express.json())



app.listen(8000 , ()=> console.log("server is running on port : 8000"))