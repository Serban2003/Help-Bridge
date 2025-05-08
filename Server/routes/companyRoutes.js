import { Router } from "express";
import { getAllCompanies, createCompany, getCompanyById, deleteCompany } from "../controllers/companyController.js";
  
const router = Router();
// If is is present in query, use id filter, else return all
router.get("/", (req, res) => {
if (req.query.id) {
    //GET /api/company?id=10
    getCompanyById(req, res);
} else {
    getAllCompanies(req, res);
}
});

router.post("/", createCompany);
router.delete('/',deleteCompany);
export default router;