import express from "express";
import {getAllRooms, addRoomType, getRoomAndRelatedData} from "../controllers/roomType.js"


const router = express.Router()

// router.get("/", getAllRooms )

router.get("/:code", getRoomAndRelatedData)

router.post("/", addRoomType )

export default router