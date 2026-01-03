import addTasksService from "./todoListServices";
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
