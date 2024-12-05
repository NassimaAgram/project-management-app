import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getTeams = async (req: Request, res: Response): Promise<void> => {
  try {
    const teams = await prisma.team.findMany();

    const teamsWithUsernames = await Promise.all(
      teams.map(async (team: any) => {
        const productOwner = await prisma.user.findUnique({
          where: { userId: team.productOwnerUserId! },
          select: { username: true },
        });

        const projectManager = await prisma.user.findUnique({
          where: { userId: team.projectManagerUserId! },
          select: { username: true },
        });

        return {
          ...team,
          productOwnerUsername: productOwner?.username,
          projectManagerUsername: projectManager?.username,
        };
      })
    );

    // Wrap the teams data in a 'data' object
    res.json({
      data: teamsWithUsernames,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving teams: ${error.message}` });
  }
};

export const getTeamById = async (req: Request, res: Response): Promise<void> => {
  const { teamId } = req.params;

  try {
    const team = await prisma.team.findUnique({
      where: { id: Number(teamId) },
      include: {
        user: true, // Fetch users in the team
        projectTeams: {
          include: {
            project: true, // Include associated projects
          },
        },
      },
    });

    if (!team) {
      res.status(404).json({ message: "Team not found" });
    }

    res.json({ data: team });
  } catch (error: any) {
    res.status(500).json({ message: `Error retrieving team: ${error.message}` });
  }
};

export const createTeam = async (req: Request, res: Response): Promise<void> => {
  const { teamName, productOwnerUserId, projectManagerUserId } = req.body;

  try {
    const newTeam = await prisma.team.create({
      data: {
        teamName,
        productOwnerUserId,
        projectManagerUserId,
      },
    });

    res.status(201).json({ message: "Team created successfully", data: newTeam });
  } catch (error: any) {
    res.status(500).json({ message: `Error creating team: ${error.message}` });
  }
};

export const updateTeam = async (req: Request, res: Response): Promise<void> => {
  const { teamId } = req.params;
  const { teamName, productOwnerUserId, projectManagerUserId } = req.body;

  try {
    const updatedTeam = await prisma.team.update({
      where: { id: Number(teamId) },
      data: {
        teamName,
        productOwnerUserId,
        projectManagerUserId,
      },
    });

    res.json({ message: "Team updated successfully", data: updatedTeam });
  } catch (error: any) {
    res.status(500).json({ message: `Error updating team: ${error.message}` });
  }
};

export const assignUsersToTeam = async (req: Request, res: Response): Promise<void> => {
  const { teamId } = req.params;
  const { userIds } = req.body; // Array of user IDs

  try {
    const team = await prisma.team.update({
      where: { id: Number(teamId) },
      data: {
        user: {
          connect: userIds.map((id: number) => ({ userId: id })),
        },
      },
    });

    res.json({ message: "Users assigned to team successfully", data: team });
  } catch (error: any) {
    res.status(500).json({ message: `Error assigning users to team: ${error.message}` });
  }
};


