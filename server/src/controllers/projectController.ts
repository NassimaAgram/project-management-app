import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export const getProjects = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const projects = await prisma.project.findMany();
    res.json({ data: projects }); // Wrap the projects in a 'data' object
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving projects: ${error.message}` });
  }
};

export const createProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, description, startDate, endDate } = req.body;
  try {
    const newProject = await prisma.project.create({
      data: {
        name,
        description,
        startDate,
        endDate,
      },
    });
    res.status(201).json({ data: newProject, message: "Project created successfully", }); // Wrap the new project in a 'data' object
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error creating a project: ${error.message}` });
  }
};

export const updateProject = async (req: Request, res: Response): Promise<void> => {
  const { projectId } = req.params;
  const { name, description, startDate, endDate } = req.body;

  try {
    const updatedProject = await prisma.project.update({
      where: { id: Number(projectId) },
      data: { name, description, startDate, endDate },
    });

    res.json({ message: "Project updated successfully", data: updatedProject });
  } catch (error: any) {
    res.status(500).json({ message: `Error updating project: ${error.message}` });
  }
};

export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  const { projectId } = req.params;

  try {
    await prisma.project.delete({
      where: { id: Number(projectId) },
    });

    res.json({ message: "Project deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: `Error deleting project: ${error.message}` });
  }
};

export const getProjectsByTeam = async (req: Request, res: Response): Promise<void> => {
  const { teamId } = req.params;

  try {
    const projects = await prisma.project.findMany({
      where: {
        projectTeams: {
          some: { teamId: Number(teamId) },
        },
      },
    });

    res.json({ data: projects });
  } catch (error: any) {
    res.status(500).json({ message: `Error retrieving projects: ${error.message}` });
  }
};


export const assignTeamToProject = async (req: Request, res: Response): Promise<void> => {
  const { projectId, teamId } = req.body;

  try {
    const projectTeam = await prisma.projectTeam.create({
      data: {
        projectId: Number(projectId),
        teamId: Number(teamId),
      },
    });

    res.status(201).json({ message: "Team assigned to project successfully", data: projectTeam });
  } catch (error: any) {
    res.status(500).json({ message: `Error assigning team to project: ${error.message}` });
  }
};
