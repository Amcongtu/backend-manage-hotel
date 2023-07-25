import express from "express";
import {getOrdersByDimension, getPaymentStatistics, getRoomTypeBookingPercentage, getStatistics, getTotalBookingsByDimension, getTotalPaymentByDimension} from "../controllers/report.js"


const router = express.Router()




router.get("/statistics", getStatistics)
router.post("/percent-roomtype",getRoomTypeBookingPercentage)
router.post("/quantity-of-date", getOrdersByDimension)
router.post("/get-payment-statistics", getPaymentStatistics)

router.post("/payment-total-statistics", getTotalPaymentByDimension)

router.post("/get-total-bookings-dimension", getTotalBookingsByDimension)
export default router