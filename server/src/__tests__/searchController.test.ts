import prismaMock from "../__mocks__/prisma";
import { search } from "../controllers/searchController";
import { Request, Response } from "express";

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

// Test for search
describe("search", () => {
  // Test for search results
  it("should return search results for tasks, projects, and users", async () => {
    const mockTasks = [
      { id: 1, title: "Task 1", description: "Task 1 description" },
      { id: 2, title: "Task 2", description: "Task 2 description" },
    ];
    const mockProjects = [
      { id: 1, name: "Project A", description: "Project A description" },
      { id: 2, name: "Project B", description: "Project B description" },
    ];
    const mockUsers = [
      { id: 1, username: "user1" },
      { id: 2, username: "user2" },
    ];

    const searchQuery = "Task";

    prismaMock.task.findMany.mockResolvedValue(mockTasks);
    prismaMock.project.findMany.mockResolvedValue(mockProjects);
    prismaMock.user.findMany.mockResolvedValue(mockUsers);

    const req = { query: { query: searchQuery } } as unknown as Request;
    const res = { json: jest.fn() } as unknown as Response;

    await search(req, res);

    expect(prismaMock.task.findMany).toHaveBeenCalledWith({
      where: {
        OR: [
          { title: { contains: searchQuery } },
          { description: { contains: searchQuery } },
        ],
      },
    });
    expect(prismaMock.project.findMany).toHaveBeenCalledWith({
      where: {
        OR: [
          { name: { contains: searchQuery } },
          { description: { contains: searchQuery } },
        ],
      },
    });
    expect(prismaMock.user.findMany).toHaveBeenCalledWith({
      where: {
        OR: [{ username: { contains: searchQuery } }],
      },
    });
    expect(res.json).toHaveBeenCalledWith({
      tasks: mockTasks,
      projects: mockProjects,
      users: mockUsers,
    });
  });

  // Test for empty results
  it("should return empty arrays when no results are found", async () => {
    const searchQuery = "NonExistentQuery";

    prismaMock.task.findMany.mockResolvedValue([]);
    prismaMock.project.findMany.mockResolvedValue([]);
    prismaMock.user.findMany.mockResolvedValue([]);

    const req = { query: { query: searchQuery } } as unknown as Request;
    const res = { json: jest.fn() } as unknown as Response;

    await search(req, res);

    expect(prismaMock.task.findMany).toHaveBeenCalledWith({
      where: {
        OR: [
          { title: { contains: searchQuery } },
          { description: { contains: searchQuery } },
        ],
      },
    });
    expect(prismaMock.project.findMany).toHaveBeenCalledWith({
      where: {
        OR: [
          { name: { contains: searchQuery } },
          { description: { contains: searchQuery } },
        ],
      },
    });
    expect(prismaMock.user.findMany).toHaveBeenCalledWith({
      where: {
        OR: [{ username: { contains: searchQuery } }],
      },
    });
    expect(res.json).toHaveBeenCalledWith({
      tasks: [],
      projects: [],
      users: [],
    });
  });
});
