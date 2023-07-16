import express from "express";
import { addRoomType, getRoomAndRelatedData, getAllRoomTypes} from "../controllers/roomType.js"


const router = express.Router()

router.get("/", getAllRoomTypes )

router.get("/:code", getRoomAndRelatedData)

router.post("/", addRoomType )

export default router