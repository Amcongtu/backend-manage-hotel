import express from "express";
import {getAllRooms, createRoom} from "../controllers/room.js"


const router = express.Router()

router.get("/", getAllRooms )


router.post("/", createRoom )

export default router