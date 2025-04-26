import { Router } from "express";
import { getAllAppointments, createAppointment, getAppointmentsByHelperId, getAppointmentsByUserId } from "../controllers/appointmentController.js";
  
const router = Router();
// If id is present in query, use id filter, else return all
router.get("/", (req, res) => {
    if (req.query.helperId) {
        //GET /api/reviews?helperId=10
        getAppointmentsByHelperId(req, res);
    } else if (req.query.userId) {
        //GET /api/reviews?userId=10
        getAppointmentsByUserId(req, res);
    }
    else {
        getAllAppointments(req, res);
    }
});

router.post("/", createAppointment);

export default router;