import authEmployeeRouter from "./authEmployee.js"
import authCustomerRouter from "./authCustomer.js"
import roomRouter from "./room.js"
import roomTypeRouter from "./roomType.js"

const initRoutes =  (app) => {

    app.use('/api/employee', authEmployeeRouter)
    app.use('/api/customer', authCustomerRouter)
    app.use('/api/room', roomRouter)
    app.use('/api/room-type', roomTypeRouter)


    
    return app.use("/", (req, res) => {
        res.send("Server on ...")
    })

}


export default initRoutes