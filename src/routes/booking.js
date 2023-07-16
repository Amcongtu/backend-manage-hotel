import express from "express";
import {createBooking} from "../controllers/booking.js"


const router = express.Router()



router.post("/", createBooking )

export default router