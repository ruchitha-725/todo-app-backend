import addTasksController from "../controllers/todoListControllers";
import addTasksService from "../services/todoListServices";
import { Request, Response } from "express";

jest.mock("../firebaseConfiguration/firebase", () => ({
  db: { collection: jest.fn() }
}));
jest.mock("../services/todoListServices");

describe("addTasksController", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;
  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    mockResponse = { status: statusMock };
    jest.clearAllMocks();
  });
  it("should return 201 on success", async () => {
    const mockTask = { id: "id123", name: "Yoga" };
    mockRequest = { body: { name: "Yoga", description: "Exercise", deadline: "2026-01-06", status: "pending", priority: "high" } };
    (addTasksService as jest.Mock).mockResolvedValue(mockTask);
    await addTasksController(mockRequest as Request, mockResponse as Response);
    expect(statusMock).toHaveBeenCalledWith(201);
    expect(jsonMock).toHaveBeenCalledWith({ message: "Success", task: mockTask });
  });
  it("should return 400 if fields are missing", async () => {
    mockRequest = { body: { name: "" } };
    await addTasksController(mockRequest as Request, mockResponse as Response);
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ message: "Please fill in all fields" });
  });
  it("should return 400 if service throws Invalid input", async () => {
    const mockTask = { name: "Reading", description: "storyBook", deadline: "2026-01-04", status: "pending", priority: "high" };
    mockRequest = { body: mockTask };
    (addTasksService as jest.Mock).mockRejectedValue(new Error("Invalid input"));
    await addTasksController(mockRequest as Request, mockResponse as Response);
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ message: "Task name already exists" });
  });
  it("should return 500 for any other service errors", async () => {
    mockRequest = { body: { name: "Zumba", description: "dancing", deadline: "2026-01-09", status: "In Progress", priority: "low" } };
    (addTasksService as jest.Mock).mockRejectedValue(new Error("Database connection failed"));
    await addTasksController(mockRequest as Request, mockResponse as Response);
    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({ message: "Something went wrong on the server" });
  });

});
