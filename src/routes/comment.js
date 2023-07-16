import express from "express";
import {createReview, deleteReview, getAllReviews, calculateAverageRating} from "../controllers/comment.js"


const router = express.Router()

router.delete("/:id", deleteReview )

router.post("/", createReview )

router.get("/", getAllReviews)

router.get("/avt-rating", calculateAverageRating)


export default router