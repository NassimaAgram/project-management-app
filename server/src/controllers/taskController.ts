import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  const { projectId } = req.query;
  try {
    const tasks = await prisma.task.findMany({
      where: {
        projectId: Number(projectId),
      },
      include: {
        author: true,
        assignee: true,
        comments: true,
        attachments: true,
      },
    });
    res.json({ data: tasks }); // Wrap the tasks in a 'data' object
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving tasks: ${error.message}` });
  }
};

export const createTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    title,
    description,
    status,
    priority,
    tags,
    startDate,
    dueDate,
    points,
    projectId,
    authorUserId,
    assignedUserId,
  } = req.body;
  console.log('Request body:', req.body);
  try {
    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
        tags,
        startDate,
        dueDate,
        points,
        projectId,
        authorUserId,
        assignedUserId,
      },
    });
    res.status(201).json({ data: newTask, message: "Task created successfully", }); // Wrap the new task in a 'data' object
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error creating a task: ${error.message}` });
  }
};

export const updateTaskStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { taskId } = req.params;
  const { status } = req.body;
  try {
    const updatedTask = await prisma.task.update({
      where: {
        id: Number(taskId),
      },
      data: {
        status: status,
      },
    });
    res.json({ data: updatedTask, message: "Task updated successfully",}); // Wrap the updated task in a 'data' object
  } catch (error: any) {
    res.status(500).json({ message: `Error updating task: ${error.message}` });
  }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  const { taskId } = req.params;

  try {
    await prisma.task.delete({
      where: { id: Number(taskId) },
    });

    res.json({ message: "Task deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: `Error deleting task: ${error.message}` });
  }
};

export const updateTask = async (req: Request, res: Response): Promise<void> => {
  const { taskId } = req.params;
  const { title, description, status, priority, tags, startDate, dueDate, points, assignedUserId } = req.body;

  try {
    const updatedTask = await prisma.task.update({
      where: { id: Number(taskId) },
      data: {
        title,
        description,
        status,
        priority,
        tags,
        startDate,
        dueDate,
        points,
        assignedUserId,
      },
    });

    res.json({ message: "Task updated successfully", data: updatedTask });
  } catch (error: any) {
    res.status(500).json({ message: `Error updating task: ${error.message}` });
  }
};

export const getOverdueTasks = async (_req: Request, res: Response): Promise<void> => {
  try {
    const overdueTasks = await prisma.task.findMany({
      where: {
        dueDate: { lt: new Date() },
        NOT: { status: "Completed" },
      },
      include: {
        author: true,
        assignee: true,
      },
    });

    res.json({ data: overdueTasks });
  } catch (error: any) {
    res.status(500).json({ message: `Error retrieving overdue tasks: ${error.message}` });
  }
};

export const assignTask = async (req: Request, res: Response): Promise<void> => {
  const { taskId } = req.params;
  const { assignedUserId } = req.body;

  try {
    const updatedTask = await prisma.task.update({
      where: { id: Number(taskId) },
      data: { assignedUserId },
    });

    res.json({ message: "Task assigned successfully", data: updatedTask });
  } catch (error: any) {
    res.status(500).json({ message: `Error assigning task: ${error.message}` });
  }
};


export const getUserTasks = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;
  try {
    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { authorUserId: Number(userId) },
          { assignedUserId: Number(userId) },
        ],
      },
      include: {
        author: true,
        assignee: true,
      },
    });
    res.json({ data: tasks }); // Wrap the tasks in a 'data' object
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving user's tasks: ${error.message}` });
  }
};
