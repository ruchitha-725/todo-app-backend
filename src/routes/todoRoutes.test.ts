import request from 'supertest';
import express, { Express } from 'express';
import todoRoutes from './todoRoutes';
import { addTasksController, viewTasksController, editTasksController, deleteTasksController } from '../controllers/todoListControllers';

jest.mock('../controllers/todoListControllers', () => ({
  addTasksController: jest.fn((req, res) => {
    res.status(200).json({ status: 'controller function called' });
  }),
  viewTasksController: jest.fn((req, res) => {
    res.status(200).json({ status: 'getTasks controller called' });
  }),
  editTasksController: jest.fn((req, res) => {
    res.status(200).json({ status: 'editTasks controller called' });
  }),
  deleteTasksController: jest.fn((req, res) => {
    res.status(200).json({ status: 'deleteTask controller called' })
  })
}));

const mockedAddTask = addTasksController as jest.Mock;
const mockedGetTasks = viewTasksController as jest.Mock;
const mockedEditTasks = editTasksController as jest.Mock;
const mockedDeleteTask = deleteTasksController as jest.Mock;

const app: Express = express();
app.use(express.json());
app.use('/todoTasks', todoRoutes);

describe('todoRoutes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should call the addTask controller function when POST is requested', async () => {
    const testBody = { name: "Yoga" };
    const response = await request(app)
      .post('/todoTasks/add')
      .send(testBody)
      .expect(200);
    expect(mockedAddTask).toHaveBeenCalledTimes(1);
    expect(response.body).toEqual({ status: 'controller function called' });
    const reqArg = mockedAddTask.mock.calls[0][0];
    expect(reqArg.body).toEqual(testBody);
  });
  it('should return 404 for a route that does not exist within the router', async () => {
    await request(app)
      .get('/todoTasks/adds')
      .expect(404);
    expect(mockedAddTask).not.toHaveBeenCalled();
  });
  it('should call the getTasks controller function when GET is requested', async () => {
    const response = await request(app)
      .get('/todoTasks/view')
      .expect(200);
    expect(mockedGetTasks).toHaveBeenCalledTimes(1);
    expect(mockedAddTask).not.toHaveBeenCalled();
    expect(response.body).toEqual({ status: 'getTasks controller called' });
  });
  it('should call the editTasks controller function when PATCH is requested', async () => {
    const result = { name: "Yoga", description: "Updated" };
    const response = await request(app)
      .patch('/todoTasks/editTask/id123')
      .send(result)
      .expect(200);
    expect(mockedEditTasks).toHaveBeenCalledTimes(1);
    expect(response.body).toEqual({ status: 'editTasks controller called' });
    const reqArg = mockedEditTasks.mock.calls[0][0];
    expect(reqArg.body).toEqual(result);
  });
  it('should call the deleteTasks controller when DELETE is requested with an ID', async () => {
    const id = "id12345";
    const response = await request(app)
      .delete(`/todoTasks/deleteTask/${id}`)
      .expect(200);
    expect(mockedDeleteTask).toHaveBeenCalledTimes(1);
    const reqArg = mockedDeleteTask.mock.calls[0][0];
    expect(reqArg.params.id).toBe(id);
    expect(response.body).toEqual({ status: 'deleteTask controller called' });
  });
  it('should return 404 if the delete URL path is wrong', async () => {
    await request(app)
      .delete('/todoTasks/deleteTasks/id123')
      .expect(404);
    expect(mockedDeleteTask).not.toHaveBeenCalled();
  });
});
