import express from "express";
import {createBooking, updateBookingStatus, getBookingList, getTodayBookings, getCustomerBookings, getBookingDetails} from "../controllers/booking.js"


const router = express.Router()



router.get("/today",getTodayBookings)

router.post("/", createBooking )

router.get("/:id",getBookingDetails)

router.get("/customer/:id", getCustomerBookings )

router.put("/:id/status",  updateBookingStatus )

router.get("/", getBookingList)



export default router