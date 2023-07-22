import express from "express";
import {getRoomTypeBookingPercentage, getStatistics} from "../controllers/report.js"


const router = express.Router()




router.get("/statistics", getStatistics)
router.post("/percent-roomtype",getRoomTypeBookingPercentage)

export default router