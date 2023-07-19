import express from "express";
import {checkAvailability, filterRooms, getRoomStatusByDate} from "../controllers/filter.js"


const router = express.Router()


router.get("/room", filterRooms)

router.get("/room/available", checkAvailability)
router.get("/room/status/", getRoomStatusByDate)



export default router