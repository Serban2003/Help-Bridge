import { Router } from "express";
import { getAllHelperCategories, createHelperCategory, getHelperCategoryById } from "../controllers/helperCategoryController.js";
  
const router = Router();
// If is is present in query, use id filter, else return all
router.get("/", (req, res) => {
if (req.query.id) {
    //GET /api/helper_categories?id=10
    getHelperCategoryById(req, res);
} else {
    getAllHelperCategories(req, res);
}
});

router.post("/", createHelperCategory);

export default router;