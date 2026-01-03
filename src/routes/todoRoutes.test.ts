import request from "supertest";
import express from "express";
import todoRoutes from "./todoRoutes";
import addTasksController from "../controllers/todoListControllers";

jest.mock("../controllers/todoListControllers", () => jest.fn((req, res) => res.status(200).send()));

const app = express();
app.use(express.json());
app.use("/todoTasks", todoRoutes); 

describe("Todo Routes", () => {
  it("should call addTasksController", async () => {
    const response = await request(app)
      .post("/todoTasks/add")
      .send({ name: "Yoga" });
    expect(response.status).toBe(200);
    expect(addTasksController).toHaveBeenCalled();
  });
});
