import express, { json } from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";

const app = express();
app.use(cors());
app.use(json());

app.use("/api/users", userRoutes);

app.listen(5000, () => console.log("API server running on http://localhost:5000"));
