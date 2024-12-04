import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const search = async (req: Request, res: Response): Promise<void> => {
  const { query } = req.query;
  try {
    // Search for tasks
    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { title: { contains: query as string } },
          { description: { contains: query as string } },
        ],
      },
    });

    // Search for projects
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { name: { contains: query as string } },
          { description: { contains: query as string } },
        ],
      },
    });

    // Search for users
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: query as string } },
          { email: { contains: query as string } },
        ],
      },
    });

    // Wrap each result in a `data` object
    res.json({
      data: {
        tasks,
        projects,
        users
      }
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error performing search: ${error.message}` });
  }
};
