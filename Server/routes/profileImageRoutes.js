import { Router } from "express";
import multer from "multer";
import {getAllProfileImages, createProfileImage, getProfileImageById } from "../controllers/profileImageController.js";
  
const router = Router();

// Setup multer to store image data in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

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

// POST /api/images - Upload a new profile image
router.post("/", upload.single("image"), createProfileImage);

export default router;