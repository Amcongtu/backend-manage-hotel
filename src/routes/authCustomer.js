import express from "express";
import {registerCustomer, loginCustomer, findCustomers} from "../controllers/authCustomer.js"


const router = express.Router()

router.post("/register", registerCustomer )

router.post("/login", loginCustomer )

router.post("/find", findCustomers)


export default router