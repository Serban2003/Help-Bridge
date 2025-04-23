import { Router } from "express";
import { getAllReviews, createReview, getReviewById, getReviewsByHelperId } from "../controllers/reviewController.js";
  
const router = Router();
// If id is present in query, use id filter, else return all
router.get("/", (req, res) => {
    if (req.query.id) {
        //GET /api/reviews?id=10
        getReviewById(req, res);
    } else if (req.query.helperId) {
        //GET /api/reviews?helperId=10
        getReviewsByHelperId(req, res);
    }
    else {
        getAllReviews(req, res);
    }
});

router.post("/", createReview);

export default router;