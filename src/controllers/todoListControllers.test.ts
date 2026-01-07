import { addTasksController, viewTasksController, editTasksController, deleteTasksController, viewHighPriorityTasksController } from "../controllers/todoListControllers";
import { addTasksService, viewTasksService, editTasksService, deleteTasksService, viewHighPriorityTasksService } from "../services/todoListServices";
import { taskPriority, taskStatus } from "../types/taskType";

jest.mock("../firebaseConfiguration/firebase", () => ({
  db: { collection: jest.fn() }
}));
jest.mock("../services/todoListServices");

describe("Task Controllers", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });
  describe("addTasksController", () => {
    it("should return 400 if fields are missing", async () => {
      req.body = { name: "Yoga" };
      await addTasksController(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Please fill in all fields" });
    });
    it("should return 201 and the task on success", async () => {
      const mockTask = { id: "id123", name: "Yoga", description: "Exercise", Status: taskStatus.PENDING, Priority: taskPriority.HIGH };
      req.body = {
        name: "Yoga",
        description: "Exercise",
        deadline: "2026-01-11",
        status: "pending",
        priority: "high"
      };
      (addTasksService as jest.Mock).mockResolvedValue(mockTask);
      await addTasksController(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Success",
        task: mockTask,
      });
    });
    it("should return 400 if the task name already exists", async () => {
      req.body = { name: "Yoga", description: "Exercise", deadline: "2026-01-05", status: "Pending", priority: "high" };
      (addTasksService as jest.Mock).mockRejectedValue(new Error("Invalid input"));
      await addTasksController(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Task name already exists" });
    });
  });
  describe("viewTasksController", () => {
    it("should return 200 and the list of tasks", async () => {
      const mockResult = [{ id: "id123", name: "Yoga" }];
      (viewTasksService as jest.Mock).mockResolvedValue(mockResult);
      await viewTasksController(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });
    it("should return 500 if something fails", async () => {
      (viewTasksService as jest.Mock).mockRejectedValue(new Error("Server Error"));
      await viewTasksController(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server Error" });
    });
    it("should return 500 and default message for an error", async () => {
      (viewTasksService as jest.Mock).mockRejectedValue({});
      await viewTasksController(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Something went wrong" });
    });
  });
});
describe("editTasksController", () => {
  let req: any;
  let res: any;
  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });
  it("should return 200 when update works", async () => {
    const req = {
      params: { id: "id123" },
      body: { name: "Yoga", description: "Stretch", deadline: "2026-01-26", status: "Pending", priority: "Low" }
    };
    (editTasksService as jest.Mock).mockResolvedValue({ name: "Yoga", id: "id123" });
    await editTasksController(req as any, res as any);
    expect(res.status).toHaveBeenCalledWith(200);
  });
  it("should return 400 if name is missing in body", async () => {
    req = {
      params: { id: "id123" },
      body: { description: "" }
    };
    await editTasksController(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Task name is required to edit" });
  });
  it("should return 500 if service crashes", async () => {
    req = {
      params: { id: "id123" },
      body: { name: "Yoga", description: "Stretching", deadline: "2026-01-01", status: "Pending", priority: "Low" }
    };
    (editTasksService as jest.Mock).mockRejectedValue(new Error("DB Error"));
    await editTasksController(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "DB Error" });
  });
  it("should return 500 if edit service throws an error", async () => {
    const req = {
      params: { id: "id123" },
      body: { name: "Yoga" }
    };
    (editTasksService as jest.Mock).mockRejectedValue({});
    await editTasksController(req as any, res as any);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Failed to update task" });
  });
});
describe("deleteTasksController", () => {
  it("should return 200 when task is deleted", async () => {
    const req = { params: { id: "id123" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    (deleteTasksService as jest.Mock).mockResolvedValue({ id: "id123" });
    await deleteTasksController(req as any, res as any);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Task deleted successfully" });
  });
  it("should return 404 if task doesn't exist", async () => {
    const req = { params: { id: "id420" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
    (deleteTasksService as jest.Mock).mockRejectedValue(new Error("Task not found"));
    await deleteTasksController(req as any, res as any);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Task not found" });
  });
});
describe("viewHighPriorityTasksController", () => {
  let req: any;
  let res: any;
  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });
  it("should return 200 and shows high priority tasks", async () => {
    const mockHighPriorityList = [
      {
        id: "id123",
        name: "Todo",
        description: "Assignment",
        deadline: "2026-01-11",
        priority: taskPriority.HIGH,
      }
    ];
    (viewHighPriorityTasksService as jest.Mock).mockResolvedValue(mockHighPriorityList);
    await viewHighPriorityTasksController(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockHighPriorityList);
  });
  it("should return 200 and empty array if no high priority tasks exist", async () => {
    (viewHighPriorityTasksService as jest.Mock).mockResolvedValue([]);
    await viewHighPriorityTasksController(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([]);
  });
  it("should return 500 if the service throws an error", async () => {
    const errorMessage = "Failed to get high priority tasks from firebase";
    (viewHighPriorityTasksService as jest.Mock).mockRejectedValue(new Error(errorMessage));
    await viewHighPriorityTasksController(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
  });
  it("should return 500 with error message if service throws an unknown error", async () => {
    (viewHighPriorityTasksService as jest.Mock).mockRejectedValue({});
    await viewHighPriorityTasksController(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Failed to get high priority tasks" });
  });
});

