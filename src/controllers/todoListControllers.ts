import { Request, Response } from "express";
import {addTasksService,viewTasksService,editTasksService,deleteTasksService}  from "../services/todoListServices"; 

export const addTasksController = async (req: Request, res: Response) => {
    try {
        const { name, description, deadline, status, priority } = req.body;
        if (!name || !description || !deadline || !status || !priority) {
            return res.status(400).json({ 
                message: "Please fill in all fields" 
            });
        }
        const result = await addTasksService(name, description, deadline, status, priority);
        return res.status(201).json({
            message: "Success",
            task: result
        });
    } catch (error: any) {
        if (error.message === "Invalid input") {
            return res.status(400).json({ message: "Task name already exists" });
        }
        return res.status(500).json({ message: "Something went wrong on the server" });
    }
};

export const viewTasksController=async(req:Request,res:Response)=>{
    try{
        const todoTasks=await viewTasksService();
        res.status(200).json(todoTasks);
    }catch (error: any) {
    res.status(error.status || 500).json({ message: error.message || "Something went wrong" });
  }
};
export const editTasksController = async (req: Request, res: Response) => {
  try {
    const { name, description, deadline, status, priority } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Task name is required to edit" });
    }
    const updatedTask = await editTasksService(name, description, deadline, status, priority);
    return res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Something went wrong" });
  }
};
export const deleteTasksController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; 
    if (!id) {
      return res.status(400).json({ message: "Task ID is required" });
    }
    await deleteTasksService(id);
    return res.status(200).json({
      message: "Task deleted successfully"
    });
  } catch (error: any) {
    const status = error.message === "Task not found" ? 404 : 500;
    return res.status(status).json({ message: error.message });
  }
};




