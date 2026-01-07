import { db } from "../firebaseConfiguration/firebase";
import task, { taskStatus, taskPriority } from "../types/taskType";

export const addTasksService = async (name: string, description: string, deadline: string, status: taskStatus, priority: taskPriority) => {
    if (!name.trim() || !description.trim() || !deadline || !status || !priority) {
        throw new Error("Missing Required fields");
    }
    name = name.trim();
    description = description.trim();
    try {
        const existing = await db.collection("tasks")
            .where('name', '==', name)
            .limit(1)
            .get();
        if (!existing.empty) {
            throw new Error(`Task with name "${name}" already exists.`);
        }
        const task = { name, description, deadline, status, priority };
        const docRef = await db.collection("tasks").add(task);
        return { ...task, id: docRef.id };
    }
    catch (error: any) {
        if (error.message && error.message.includes("Task with name")) {
            throw new Error("Invalid input");
        }
        throw error;
    }
};
export const viewTasksService = async () => {
    try {
        const result = await db.collection("tasks").get();
        if (result.empty) {
            return [];
        }
        const todoTask = result.docs.map((doc) => {
            return {
                id: doc.id,
                ...doc.data()
            } as task;
        });
        return todoTask;
    } catch (error) {
        throw new Error("Failed to retrieve the tasks from database");
    }
};
export const editTasksService = async (
    id: string,
    name: string,
    description: string,
    deadline: string,
    status: string,
    priority: string
) => {
    try {
        const taskRef = db.collection("tasks").doc(id);
        const doc = await taskRef.get();
        if (!doc.exists) {
            throw new Error("Task not found");
        }
        await taskRef.update({
            name,
            description,
            deadline,
            status,
            priority
        });
        return { id, name, description, deadline, status, priority };
    }
    catch (error: any) {
        if (error.message === "Task not found") {
            throw error;
        }
        throw new Error("Failed to update task");
    }
};
export const deleteTasksService = async (id: string) => {
    try {
        const result = db.collection("tasks").doc(id);
        const doc = await result.get();
        if (!doc.exists) {
            throw new Error("Task not found");
        }
        await result.delete();
        return { id, message: "Deleted successfully" };
    } catch (error: any) {
        throw new Error(error.message || "Failed to delete task");
    }
};
export const viewHighPriorityTasksService = async () => {
    try {
        const result = await db.collection("tasks")
            .where("priority", "==", taskPriority.HIGH)
            .get();
        if (result.empty) {
            return [];
        }
        return result.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        })) as task[];
    } catch (error) {
        throw new Error("Failed to get high priority tasks from firebase");
    }
};



