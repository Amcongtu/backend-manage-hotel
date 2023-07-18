import express from "express";
import {createBooking, updateBookingStatus, getBookingList, getTodayBookings} from "../controllers/booking.js"


const router = express.Router()



router.post("/", createBooking )
router.put("/:id",  updateBookingStatus )

router.get("/", getBookingList)

router.get("/tody",getTodayBookings)


export default router