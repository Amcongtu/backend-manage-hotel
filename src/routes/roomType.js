import express from "express";
import {getAllRooms, addRoomType} from "../controllers/roomType.js"


const router = express.Router()

// router.get("/", getAllRooms )


router.post("/", addRoomType )

export default router