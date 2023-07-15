import express  from "express";

import dotenv from "dotenv"

import conectDB from "./src/config/conectDB.js";

import cors from "cors"

import initRoutes from "./src/routes/index.js"

dotenv.config()
const app = express();
app.use(cors())

app.use(express.json())

app.use(express.urlencoded({extended:true}))

initRoutes(app)

conectDB()


const port = process.env.PORT || 8800

const listener = app.listen(port, ()=>{
    console.log("Server is running on " + `${listener.address().port}`  )
})

