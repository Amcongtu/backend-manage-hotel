import express from "express";
import {createCheckOut} from "../controllers/checkOut.js"


const router = express.Router()

// router.get("/", getAllRooms )

// router.get("/:id", getRoomById )


router.post("/", createCheckOut )

// router.delete("/:id", deleteRoom)

export default router