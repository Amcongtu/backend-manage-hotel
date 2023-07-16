import authEmployeeRouter from "./authEmployee.js"
import authCustomerRouter from "./authCustomer.js"

const initRoutes =  (app) => {

    app.use('/api/employee', authEmployeeRouter)
    app.use('/api/customer', authCustomerRouter)


    
    return app.use("/", (req, res) => {
        res.send("Server on ...")
    })

}


export default initRoutes