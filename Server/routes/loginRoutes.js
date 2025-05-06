import { Router } from "express";
import { loginUser } from "../controllers/userController.js";

const router = Router();

// POST /api/login
router.post("/", async (req, res) => {
  const { email, password } = req.body;
  await loginUser(email, password, res);
});

export default router;
