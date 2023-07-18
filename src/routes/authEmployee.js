import express from "express";
import {registerEmployee, loginEmployee, getEmployees} from "../controllers/authEmployee.js"


const router = express.Router()

router.post("/register", registerEmployee )
router.post("/login", loginEmployee )
router.get("/", getEmployees)

export default router