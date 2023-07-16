import express from "express";
import {checkAvailability, filterRooms} from "../controllers/filter.js"


const router = express.Router()


router.get("/room", filterRooms)

router.get("/room/available", checkAvailability)



export default router