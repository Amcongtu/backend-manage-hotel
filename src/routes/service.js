import express from "express";
import {createService, getServices} from "../controllers/service.js"


const router = express.Router()



router.post("/", createService )
router.get("/", getServices )

export default router