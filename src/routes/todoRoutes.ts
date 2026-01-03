import { Router } from "express";
import addTasksController  from "../controllers/todoListControllers";

const todoRoutes = Router();

todoRoutes.post("/add", addTasksController);

export default todoRoutes;