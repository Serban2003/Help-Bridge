import { Router } from "express";
import {getAllAvailabilities, getAvailabilityByHelperId, createAvailability} from "../controllers/availabilityController.js"
  
const router = Router();
// If id is present in query, use id filter, else return all
router.get("/", (req, res) => {
    if (req.query.helperId) {
        //GET /api/reviews?helperId=10
        getAvailabilityByHelperId(req, res);
    }
    else {
        getAllAvailabilities(req, res);
    }
});

router.post("/", createAvailability);

export default router;