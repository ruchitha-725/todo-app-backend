import { Router } from "express";
import {addTasksController,viewTasksController,editTasksController}  from "../controllers/todoListControllers";

const todoRoutes = Router();

todoRoutes.post("/add", addTasksController);
todoRoutes.get("/view",viewTasksController);
todoRoutes.patch("/editTask",editTasksController)

export default todoRoutes;