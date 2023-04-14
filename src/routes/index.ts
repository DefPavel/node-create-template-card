import { Router } from "express";
import { getAllStudents } from "../controllers/students";
const routes = Router();

 routes.get("/students/get/all", getAllStudents);

 // routes.use("/workers", auth);

export default routes;