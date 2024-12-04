import prismaMock from "../__mocks__/prisma";
import { getTasks, createTask, updateTaskStatus, getUserTasks } from "../controllers/taskController";
import { Request, Response } from "express";

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

// Test for getTasks
describe("getTasks", () => {
  it("should return a list of tasks", async () => {
    const mockTasks = [
      { id: 1, title: "Task A", description: "Description A", status: "Open", projectId: 1, authorUserId: 1, assignedUserId: 2 },
      { id: 2, title: "Task B", description: "Description B", status: "In Progress", projectId: 1, authorUserId: 1, assignedUserId: 2 },
    ];

    prismaMock.task.findMany.mockResolvedValue(mockTasks);

    const req = { query: { projectId: "1" } } as unknown as Request;
    const res = { json: jest.fn() } as unknown as Response;

    await getTasks(req, res);

    expect(prismaMock.task.findMany).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      data: mockTasks
    });
  });

  it("should return an empty array when no tasks exist", async () => {
    prismaMock.task.findMany.mockResolvedValue([]);

    const req = { query: { projectId: "1" } } as unknown as Request;
    const res = { json: jest.fn() } as unknown as Response;

    await getTasks(req, res);

    expect(prismaMock.task.findMany).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      data: []
    });
  });

  it("should return a 500 error if the database call fails", async () => {
    const mockError = new Error("Database error");

    prismaMock.task.findMany.mockRejectedValue(mockError);

    const req = { query: { projectId: "1" } } as unknown as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

    await getTasks(req, res);

    expect(prismaMock.task.findMany).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: `Error retrieving tasks: ${mockError.message}`,
    });
  });
});

// Test for createTask
describe("createTask", () => {
  it("should create a new task and return it", async () => {
    const mockNewTask = {
      id: 1,
      title: "Task A",
      description: "Description A",
      status: "Open",
      projectId: 1,
      authorUserId: 1,
      assignedUserId: 2,
    };

    prismaMock.task.create.mockResolvedValue(mockNewTask);

    const req = {
      body: {
        title: "Task A",
        description: "Description A",
        status: "Open",
        projectId: 1,
        authorUserId: 1,
        assignedUserId: 2,
      },
    } as Request;

    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

    await createTask(req, res);

    expect(prismaMock.task.create).toHaveBeenCalledWith({
      data: {
        title: "Task A",
        description: "Description A",
        status: "Open",
        projectId: 1,
        authorUserId: 1,
        assignedUserId: 2,
      },
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      data: mockNewTask
    });
  });

  it("should return a 500 error if the database call fails", async () => {
    const mockError = new Error("Database error");

    prismaMock.task.create.mockRejectedValue(mockError);

    const req = {
      body: {
        title: "Task A",
        description: "Description A",
        status: "Open",
        projectId: 1,
        authorUserId: 1,
        assignedUserId: 2,
      },
    } as Request;

    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

    await createTask(req, res);

    expect(prismaMock.task.create).toHaveBeenCalledWith({
      data: {
        title: "Task A",
        description: "Description A",
        status: "Open",
        projectId: 1,
        authorUserId: 1,
        assignedUserId: 2,
      },
    });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: `Error creating a task: ${mockError.message}`,
    });
  });
});

// Test for updateTaskStatus
describe("updateTaskStatus", () => {
  it("should update the task status and return the updated task", async () => {
    const mockUpdatedTask = {
      id: 1,
      title: "Task A",
      description: "Description A",
      status: "Completed",
      projectId: 1,
      authorUserId: 1,
      assignedUserId: 2,
    };

    prismaMock.task.update.mockResolvedValue(mockUpdatedTask);

    const req = { params: { taskId: "1" }, body: { status: "Completed" } } as unknown as Request;
    const res = { json: jest.fn() } as unknown as Response;

    await updateTaskStatus(req, res);

    expect(prismaMock.task.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { status: "Completed" },
    });
    expect(res.json).toHaveBeenCalledWith({
      data: mockUpdatedTask
    });
  });

  it("should return a 500 error if the database call fails", async () => {
    const mockError = new Error("Database error");

    prismaMock.task.update.mockRejectedValue(mockError);

    const req = { params: { taskId: "1" }, body: { status: "Completed" } } as unknown as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

    await updateTaskStatus(req, res);

    expect(prismaMock.task.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { status: "Completed" },
    });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: `Error updating task: ${mockError.message}`,
    });
  });
});

// Test for getUserTasks
describe("getUserTasks", () => {
  it("should return a list of tasks for a user", async () => {
    const mockUserTasks = [
      { id: 1, title: "Task A", description: "Description A", status: "Open", authorUserId: 1, assignedUserId: 2 },
      { id: 2, title: "Task B", description: "Description B", status: "In Progress", authorUserId: 1, assignedUserId: 2 },
    ];

    prismaMock.task.findMany.mockResolvedValue(mockUserTasks);

    const req = { params: { userId: "1" } } as unknown as Request;
    const res = { json: jest.fn() } as unknown as Response;

    await getUserTasks(req, res);

    expect(prismaMock.task.findMany).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      data: mockUserTasks
    });
  });

  it("should return an empty array when no tasks are assigned to the user", async () => {
    prismaMock.task.findMany.mockResolvedValue([]);

    const req = { params: { userId: "1" } } as unknown as Request;
    const res = { json: jest.fn() } as unknown as Response;

    await getUserTasks(req, res);

    expect(prismaMock.task.findMany).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      data: []
    });
  });

  it("should return a 500 error if the database call fails", async () => {
    const mockError = new Error("Database error");

    prismaMock.task.findMany.mockRejectedValue(mockError);

    const req = { params: { userId: "1" } } as unknown as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

    await getUserTasks(req, res);

    expect(prismaMock.task.findMany).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: `Error retrieving user's tasks: ${mockError.message}`,
    });
  });
});
