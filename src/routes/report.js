import express from "express";
import {getOrdersByDimension, getPaymentStatistics, getRoomTypeBookingPercentage, getStatistics} from "../controllers/report.js"


const router = express.Router()




router.get("/statistics", getStatistics)
router.post("/percent-roomtype",getRoomTypeBookingPercentage)
router.post("/quantity-of-date", getOrdersByDimension)
router.post("/get-payment-statistics", getPaymentStatistics)

export default router