import { Router } from "express";
import {
  getAllHelpers,
  getHelperByEmail,
  getHelpersByHelperCategoryId,
  getHelperById,
  createHelper,
  deleteHelper,
  updateHelperById,
  changeHelperPassword
} from "../controllers/helperController.js";

const router = Router();
// If is is present in query, use id filter, else return all
router.get("/", (req, res) => {
  if (req.query.id) {
    //GET /api/helpers?id=10
    getHelperById(req, res);
  } else if (req.query.helperCategoryId) {
    //GET /api/helpers?helperCatergoryId=10
    getHelpersByHelperCategoryId(req, res);
  } else if (req.query.email) {
    //GET /api/helpers?email=joedoe@gmail.com
    getHelperByEmail(req, res);
  } else {
    getAllHelpers(req, res);
  }
});

router.post("/", createHelper);
router.post("/change-password", changeHelperPassword);
router.put("/", updateHelperById);
router.delete("/", deleteHelper);
export default router;
