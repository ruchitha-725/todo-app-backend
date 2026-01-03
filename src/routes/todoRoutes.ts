import { Router } from "express";
import {addTasksController,viewTasksController,editTasksController,deleteTasksController}  from "../controllers/todoListControllers";

const todoRoutes = Router();

todoRoutes.post("/add", addTasksController);
todoRoutes.get("/view",viewTasksController);
todoRoutes.patch("/editTask",editTasksController);
todoRoutes.delete("/deleteTask/:id", deleteTasksController);

export default todoRoutes;