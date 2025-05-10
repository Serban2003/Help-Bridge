import { Router } from "express";
import {
  getAllUsers,
  createUser,
  getUserByEmail,
  getUserById,
  deleteUser,
} from "../controllers/userController.js";

const router = Router();
// If email is present in query, use email filter, else return all
router.get("/", (req, res) => {
  if (req.query.id) {
    //GET /api/users?id=10
    getUserById(req, res);
  } else if (req.query.email) {
    //GET /api/users?email=john@example.com
    getUserByEmail(req, res);
  } else {
    getAllUsers(req, res);
  }
});

router.post("/", createUser);
router.delete("/", deleteUser);
export default router;
