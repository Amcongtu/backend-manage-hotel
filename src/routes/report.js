import express from "express";
import {getOrdersByDimension, getPaymentStatistics, getRoomTypeBookingPercentage, getStatistics, getTotalPaymentByDimension} from "../controllers/report.js"


const router = express.Router()




router.get("/statistics", getStatistics)
router.post("/percent-roomtype",getRoomTypeBookingPercentage)
router.post("/quantity-of-date", getOrdersByDimension)
router.post("/get-payment-statistics", getPaymentStatistics)

router.post("/payment-total-statistics", getTotalPaymentByDimension)
export default router