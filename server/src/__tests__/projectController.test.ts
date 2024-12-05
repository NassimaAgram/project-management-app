import prismaMock from "../__mocks__/prisma";
import { getProjects, createProject } from "../controllers/projectController"; 
import { Request, Response } from "express";

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

// Test for getProjects
describe("getProjects", () => {
  it("should return a list of projects", async () => {
    const mockProjects = [
      { id: 1, name: "Project A", description: "Desc A", startDate: null, endDate: null },
      { id: 2, name: "Project B", description: "Desc B", startDate: null, endDate: null },
    ];

    prismaMock.project.findMany.mockResolvedValue(mockProjects);

    const req = {} as Request;
    const res = { json: jest.fn() } as unknown as Response;

    await getProjects(req, res);

    expect(prismaMock.project.findMany).toHaveBeenCalledTimes(1);
    // Expecting the response to be wrapped in a 'data' object
    expect(res.json).toHaveBeenCalledWith({ data: mockProjects });
  });

  it("should return an empty array when no projects exist", async () => {
    prismaMock.project.findMany.mockResolvedValue([]);

    const req = {} as Request;
    const res = { json: jest.fn() } as unknown as Response;

    await getProjects(req, res);

    expect(prismaMock.project.findMany).toHaveBeenCalledTimes(1);
    // Expecting the response to be wrapped in a 'data' object
    expect(res.json).toHaveBeenCalledWith({ data: [] });
  });

  it("should return a 500 error if the database call fails", async () => {
    const mockError = new Error("Database error");

    prismaMock.project.findMany.mockRejectedValue(mockError);

    const req = {} as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

    await getProjects(req, res);

    expect(prismaMock.project.findMany).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: `Error retrieving projects: ${mockError.message}`,
    });
  });
});

// Test for createProject
describe("createProject", () => {
  it("should return a 500 error if the database call fails", async () => {
    const mockError = new Error("Database error");

    prismaMock.project.create.mockRejectedValue(mockError);

    const req = {
      body: {
        name: "Project A",
        description: "Desc A",
        startDate: new Date("2023-01-01"),
        endDate: new Date("2023-12-31"),
      },
    } as Request;

    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

    await createProject(req, res);

    expect(prismaMock.project.create).toHaveBeenCalledWith({
      data: {
        name: "Project A",
        description: "Desc A",
        startDate: new Date("2023-01-01"),
        endDate: new Date("2023-12-31"),
      },
    });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: `Error creating a project: ${mockError.message}`,
    });
  });
});
