import express from "express";
import {filterRooms} from "../controllers/filter.js"


const router = express.Router()


router.get("/room", filterRooms)



export default router