import express from "express";
import {getAllRooms, createRoom, getRoomById, deleteRoom} from "../controllers/room.js"


const router = express.Router()

router.get("/", getAllRooms )

router.get("/:id", getRoomById )


router.post("/", createRoom )

router.delete("/:id", deleteRoom)

export default router