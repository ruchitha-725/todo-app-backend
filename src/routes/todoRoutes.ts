import { Router } from "express";
import { addTasksController, viewTasksController, editTasksController, deleteTasksController,viewHighPriorityTasksController } from "../controllers/todoListControllers";

const todoRoutes = Router();

todoRoutes.post("/add", addTasksController);
todoRoutes.get("/view", viewTasksController);
todoRoutes.patch("/editTask/:id", editTasksController);
todoRoutes.delete("/deleteTask/:id", deleteTasksController);
todoRoutes.get('/priority/high', viewHighPriorityTasksController);

export default todoRoutes;