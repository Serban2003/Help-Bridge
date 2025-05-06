import { Router } from "express";
import {getAllHelpers, getHelperByEmail, getHelpersByHelperCategoryId, createHelper } from "../controllers/helperController.js";

const router = Router();
// If is is present in query, use id filter, else return all
router.get("/", (req, res) => {
if (req.query.helperCategoryId) {
    //GET /api/helpers?helperCatergoryId=10
    getHelpersByHelperCategoryId(req, res);
} else if (req.query.email) {
    //GET /api/helpers?email=joedoe@gmail.com
    getHelperByEmail(req, res);
}
else {
    getAllHelpers(req, res);
}
});

router.post("/", createHelper);

export default router;