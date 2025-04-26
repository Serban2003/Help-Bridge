import { Router } from "express";
import {getAllProfileImages, createProfileImage, getProfileImageById } from "../controllers/profileImageController.js";
  
const router = Router();
// If is is present in query, use id filter, else return all
router.get("/", (req, res) => {
if (req.query.id) {
    //GET /api/helpers?helperCatergoryId=10
    getProfileImageById(req, res);
} 
else {
    getAllProfileImages(req, res);
}
});

router.post("/", createProfileImage);

export default router;