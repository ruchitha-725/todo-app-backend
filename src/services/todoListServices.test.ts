import { addTasksService, viewTasksService, editTasksService, deleteTasksService } from "./todoListServices";
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
  const mockUpdate = jest.fn();
  const mockGet = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
    (db.collection as jest.Mock).mockReturnValue({
      doc: jest.fn().mockReturnValue({ get: mockGet, update: mockUpdate })
    });
  });
  it("should update a task successfully", async () => {
    mockGet.mockResolvedValue({ exists: true });
    mockUpdate.mockResolvedValue(true);
    const result = await editTasksService("id123", "Yoga", "Dance", "2026-01-26", "Pending", "High");
    expect(result.id).toBe("id123");
    expect(mockUpdate).toHaveBeenCalled();
  });

  it("should throw error if task is not found", async () => {
    mockGet.mockResolvedValue({ exists: false });
    await expect(editTasksService("id404", "No", "Descrip", "Dead", "Status", "Priority"))
      .rejects.toThrow("Task not found");
  });
  it("should throw error if database fails", async () => {
    mockGet.mockRejectedValue(new Error("DB Crash"));
    await expect(editTasksService("id123", "N", "D", "Dt", "S", "P"))
      .rejects.toThrow("Failed to update task");
  });
});
describe("deleteTasksService", () => {
  const mockId = "id123";
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should delete the task successfully if it exists", async () => {
    const mockGet = jest.fn().mockResolvedValue({ exists: true });
    const mockDelete = jest.fn().mockResolvedValue(true);
    (db.collection as jest.Mock).mockReturnValue({
      doc: jest.fn().mockReturnValue({
        get: mockGet,
        delete: mockDelete,
      }),
    });
    const result = await deleteTasksService(mockId);
    expect(result.message).toBe("Deleted successfully");
    expect(mockDelete).toHaveBeenCalledTimes(1);
  });
  it("should throw Task not found if the document does not exist", async () => {
    const mockGet = jest.fn().mockResolvedValue({ exists: false });
    (db.collection as jest.Mock).mockReturnValue({
      doc: jest.fn().mockReturnValue({
        get: mockGet,
      }),
    });
    await expect(deleteTasksService("id420")).rejects.toThrow("Task not found");
  });
  it("should throw a database error if something crashes", async () => {
    (db.collection as jest.Mock).mockReturnValue({
      doc: jest.fn().mockImplementation(() => {
        throw new Error("DB Connection Lost");
      }),
    });
    await expect(deleteTasksService(mockId)).rejects.toThrow("DB Connection Lost");
  });
});


