import { Router } from "express";
import {addTasksController,viewTasksController}  from "../controllers/todoListControllers";

const todoRoutes = Router();

todoRoutes.post("/add", addTasksController);
todoRoutes.get("/view",viewTasksController);

export default todoRoutes;