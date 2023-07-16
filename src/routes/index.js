import authEmployeeRouter from "./authEmployee.js"
import authCustomerRouter from "./authCustomer.js"
import roomRouter from "./room.js"
import roomTypeRouter from "./roomType.js"
import commentRouter from "./comment.js"
const initRoutes =  (app) => {

    app.use('/api/employee', authEmployeeRouter)
    app.use('/api/customer', authCustomerRouter)
    app.use('/api/room', roomRouter)
    app.use('/api/room-type', roomTypeRouter)
    app.use('/api/comment', commentRouter)


    
    return app.use("/", (req, res) => {
        res.send("Server on ...")
    })

}


export default initRoutes