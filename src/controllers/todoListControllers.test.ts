import { addTasksController, viewTasksController,editTasksController } from "../controllers/todoListControllers"; 
import { addTasksService, viewTasksService,editTasksService } from "../services/todoListServices";
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
      const mockTask = { id: "id123", name: "Yoga", description: "Exercise",Status:taskStatus.PENDING,Priority:taskPriority.HIGH };
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
      const mockList = [{ id: "id123", name: "Yoga" }];
      (viewTasksService as jest.Mock).mockResolvedValue(mockList);
      await viewTasksController(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockList);
    });
    it("should return 500 if something fails", async () => {
      (viewTasksService as jest.Mock).mockRejectedValue(new Error("Server Error"));
      await viewTasksController(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server Error" });
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
    req = { 
      body: { name: "Yoga", description: "Stretching", deadline: "2026-01-01", status: "Pending", priority: "Low" } 
    };
    (editTasksService as jest.Mock).mockResolvedValue({ name: "Yoga", id: "id123" });
    await editTasksController(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Task updated successfully" }));
  });
  it("should return 400 if name is missing in body", async () => {
    req = { body: { description: "" } }; 
    await editTasksController(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Task name is required to edit" });
  });
  it("should return 500 if service crashes", async () => {
    req = { body: { name: "Yoga", description: "Stretching", deadline: "2026-01-01", status: "Pending", priority: "Low" } };
    (editTasksService as jest.Mock).mockRejectedValue(new Error("DB Error"));
    await editTasksController(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "DB Error" });
  });
});

