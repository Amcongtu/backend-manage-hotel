import express from "express";
import {getAllRooms, createRoom, getRoomById} from "../controllers/room.js"


const router = express.Router()

router.get("/", getAllRooms )

router.get("/:id", getRoomById )


router.post("/", createRoom )

export default router