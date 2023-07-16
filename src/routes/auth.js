import express from "express";
import {registerEmployee, loginEmpoloyee} from "../controllers/authEmployee.js"


const router = express.Router()

router.post("/register", registerEmployee )
router.post("/login", loginEmpoloyee )

export default router