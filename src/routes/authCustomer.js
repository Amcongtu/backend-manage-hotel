import express from "express";
import {registerCustomer, loginCustomer, findCustomers, getCustomers} from "../controllers/authCustomer.js"


const router = express.Router()

router.post("/register", registerCustomer )

router.post("/login", loginCustomer )

router.post("/find", findCustomers)


router.get("/", getCustomers)

export default router