import { Router } from "express";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../controllers/category.controller.js";

const categoryRoutes = Router();

categoryRoutes.get("/", getCategories);
categoryRoutes.post("/", createCategory);
categoryRoutes.put("/:id", updateCategory);
categoryRoutes.delete("/:id", deleteCategory);

export default categoryRoutes;
