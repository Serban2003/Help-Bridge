import express, { json } from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import helperCategoryRoutes from "./routes/helperCategoryRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import helperRoutes from "./routes/helperRoutes.js";

const app = express();
app.use(cors());
app.use(json());

app.use("/api/users", userRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/helper_categories", helperCategoryRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/helpers", helperRoutes);

app.listen(5000, () => console.log("API server running on http://localhost:5000"));
