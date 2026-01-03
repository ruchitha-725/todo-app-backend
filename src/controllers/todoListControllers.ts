import { Request, Response } from "express";
import addTasksService  from "../services/todoListServices"; 

const addTasksController = async (req: Request, res: Response) => {
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
export default addTasksController;
