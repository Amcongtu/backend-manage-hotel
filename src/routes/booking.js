import express from "express";
import {createBooking, updateBookingStatus, getBookingList, getTodayBookings, getCustomerBookings, getBookingDetails} from "../controllers/booking.js"


const router = express.Router()



router.post("/", createBooking )

router.get("/today",getTodayBookings)
router.get("/:id",getBookingDetails)

router.get("/customer/:id", getCustomerBookings )

router.put("/:id/status",  updateBookingStatus )

router.get("/", getBookingList)



export default router