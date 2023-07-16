import express from "express";
import {createFacility, updateFacility} from "../controllers/facility.js"


const router = express.Router()



router.post("/", createFacility )
router.put("/:id", updateFacility )

export default router