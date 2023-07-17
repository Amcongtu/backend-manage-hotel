import express from "express";
import {createBooking, getBookingList} from "../controllers/booking.js"


const router = express.Router()



router.post("/", createBooking )

router.get("/", getBookingList)
export default router