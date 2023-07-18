import express from "express";
import { addRoomType, getRoomAndRelatedData, getAllRoomTypes, updateRoomType, deleteRoomType} from "../controllers/roomType.js"


const router = express.Router()

router.get("/", getAllRoomTypes )

router.get("/:code", getRoomAndRelatedData)

router.post("/", addRoomType )

router.put("/:id", updateRoomType)

router.delete("/:id", deleteRoomType)

export default router