import authRouter from "./auth.js"

const initRoutes =  (app) => {
    app.use('/api/employee', authRouter)




    
    return app.use("/", (req, res) => {
        res.send("Server on ...")
    })

}


export default initRoutes