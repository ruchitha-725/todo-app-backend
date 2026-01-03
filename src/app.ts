import express from "express";
import cors from "cors";
import todoRoutes from "./routes/todoRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/todoTasks", todoRoutes);

export default app;
