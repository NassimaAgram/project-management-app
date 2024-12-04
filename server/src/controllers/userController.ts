import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany();
    res.json({ data: users });  // Wrap the result in a 'data' object
  } catch (error: any) {
    res.status(500).json({ message: `Error retrieving users: ${error.message}` });
  }
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
  const { clerkId } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: {
        clerkId: clerkId,
      },
    });

    res.json({ data: user });  // Wrap the result in a 'data' object
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving user: ${error.message}` });
  }
};

export const postUser = async (req: Request, res: Response) => {
  try {
    const {
      clerkId,
      username,
      email,
      profilePictureUrl,
      teamId,
    } = req.body;

    // Validate user data
    if (!clerkId || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { clerkId }, 
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const data = await prisma.user.create({
      data: {
        clerkId,
        username,
        email,
        profilePictureUrl,
        teamId,
      },
    });
    res.status(201).json({ message: "User Created Successfully", data });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving users: ${error.message}` });
  }
};
