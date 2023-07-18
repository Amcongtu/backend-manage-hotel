import express from "express";
import {createCheckIn} from "../controllers/checkIn.js"


const router = express.Router()

// router.get("/", getAllRooms )

// router.get("/:id", getRoomById )


router.post("/", createCheckIn )

// router.delete("/:id", deleteRoom)

export default router