import {addTasksService,viewTasksService,editTasksService} from "./todoListServices";
import { db } from "../firebaseConfiguration/firebase";
import { taskStatus, taskPriority } from "../types/taskType";

jest.mock("../firebaseConfiguration/firebase", () => ({
  db: {
    collection: jest.fn(),
  },
}));

describe("addTasksService", () => {
  const mockTaskData = {
    name: "Yoga",
    description: "Exercise",
    deadline: "2026-01-11",
    status: "pending" as taskStatus,
    priority: "high" as taskPriority,
  };
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should throw error if required fields are missing", async () => {
    await expect(
      addTasksService("", "", "", "pending" as any, "high" as any)
    ).rejects.toThrow("Missing Required fields");
  });
  it("should throw error if task with same name already exists", async () => {
    (db.collection as jest.Mock).mockReturnValue({
      where: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      get: jest.fn().mockResolvedValue({ empty: false }),
    });
    await expect(
      addTasksService(
        mockTaskData.name,
        mockTaskData.description,
        mockTaskData.deadline,
        mockTaskData.status,
        mockTaskData.priority
      )
    ).rejects.toThrow("Invalid input"); 
  });
  it("should successfully add a task and return data with ID", async () => {
    const mockId = "id123";
    const mockAdd = jest.fn().mockResolvedValue({ id: mockId });
    (db.collection as jest.Mock).mockReturnValue({
      where: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      get: jest.fn().mockResolvedValue({ empty: true }),
      add: mockAdd,
    });
    const result = await addTasksService(
      mockTaskData.name,
      mockTaskData.description,
      mockTaskData.deadline,
      mockTaskData.status,
      mockTaskData.priority
    );
    expect(result).toEqual({ ...mockTaskData, id: mockId });
    expect(mockAdd).toHaveBeenCalledWith(mockTaskData);
  });
    it("should throw error if a database error occurs", async () => {
    (db.collection as jest.Mock).mockReturnValue({
      where: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      get: jest.fn().mockRejectedValue(new Error("Database connection failed")),
    });
    await expect(
      addTasksService(
        mockTaskData.name,
        mockTaskData.description,
        mockTaskData.deadline,
        mockTaskData.status,
        mockTaskData.priority
      )
    ).rejects.toThrow("Database connection failed");
  });

});

describe("viewTasksService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should return an empty array if there are no tasks", async () => {
    (db.collection as jest.Mock).mockReturnValue({
      get: jest.fn().mockResolvedValue({ empty: true }),
    });
    const result = await viewTasksService();
    expect(result).toEqual([]);
  });
    it("should return a list of tasks when the database has data", async () => {
    const mockDocs = [
      {
        id: "id123",
        data: () => ({ 
          name: "Yoga",
          description: "Exercise", 
          deadline: "2026-01-11",
          Status: taskStatus.IN_PROGRESS,
          Priority: taskPriority.MEDIUM 
        }),
      },
      {
        id: "id234",
        data: () => ({ 
          name: "Coding",
          description: "Assignment", 
          deadline: "2026-02-15", 
          Status: taskStatus.PENDING,
          Priority: taskPriority.HIGH
        }),
      },
    ];
    (db.collection as jest.Mock).mockReturnValue({
      get: jest.fn().mockResolvedValue({
        empty: false,
        docs: mockDocs,
      }),
    });
    const result = await viewTasksService();
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ 
      id: "id123", 
      name: "Yoga", 
      description: "Exercise", 
      deadline: "2026-01-11",
      Status: taskStatus.IN_PROGRESS,
      Priority: taskPriority.MEDIUM 
    });
    expect(result[1].name).toBe("Coding");
  });
  it("should throw an error message if the database fails", async () => {
    (db.collection as jest.Mock).mockReturnValue({
      get: jest.fn().mockRejectedValue(new Error("Firebase connection lost")),
    });
    await expect(viewTasksService()).rejects.toThrow(
      "Failed to retrieve the tasks from database"
    );
  });
});
describe("editTasksService", () => {
  it("should update a task successfully", async () => {
    const mockResult = {
      empty: false,
      docs: [{ id: "id123" }]
    };
    const mockUpdate = jest.fn().mockResolvedValue(true);
    (db.collection as jest.Mock).mockReturnValue({
      where: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      get: jest.fn().mockResolvedValue(mockResult),
      doc: jest.fn().mockReturnValue({ update: mockUpdate }) 
    });
    const result = await editTasksService("Yoga", "Stretching", "2026-05-01", "Pending", "low");
    expect(result.id).toBe("id123");
    expect(mockUpdate).toHaveBeenCalled();
  });
  it("should throw error if task is not found", async () => {
    (db.collection as jest.Mock).mockReturnValue({
      where: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      get: jest.fn().mockResolvedValue({ empty: true }) 
    });
    await expect(editTasksService("Fake", "", "", "", "")).rejects.toThrow("Failed to update task");
  });
});

