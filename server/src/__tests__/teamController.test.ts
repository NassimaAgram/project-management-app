import prismaMock from "../__mocks__/prisma";
import { getTeams } from "../controllers/teamController";
import { Request, Response } from "express";

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

// Test for getTeams
describe("getTeams", () => {
  it("should return a list of teams with usernames for productOwner and projectManager", async () => {
    const mockTeams = [
      {
        id: 1,
        name: "Team A",
        productOwnerUserId: 1,
        projectManagerUserId: 2,
      },
      {
        id: 2,
        name: "Team B",
        productOwnerUserId: 3,
        projectManagerUserId: 4,
      },
    ];

    const mockUsers = [
      { userId: 1, username: "user1" },
      { userId: 2, username: "user2" },
      { userId: 3, username: "user3" },
      { userId: 4, username: "user4" },
    ];

    prismaMock.team.findMany.mockResolvedValue(mockTeams);
    prismaMock.user.findUnique.mockImplementation((args: any) => {
      return mockUsers.find(
        (user) => user.userId === args.where.userId
      );
    });

    const req = {} as Request;
    const res = { json: jest.fn() } as unknown as Response;

    await getTeams(req, res);

    const expectedTeamsWithUsernames = [
      {
        ...mockTeams[0],
        productOwnerUsername: "user1",
        projectManagerUsername: "user2",
      },
      {
        ...mockTeams[1],
        productOwnerUsername: "user3",
        projectManagerUsername: "user4",
      },
    ];

    expect(prismaMock.team.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(4);
    expect(res.json).toHaveBeenCalledWith({
      data: expectedTeamsWithUsernames
    });
  });

  it("should return an empty array when no teams exist", async () => {
    prismaMock.team.findMany.mockResolvedValue([]);

    const req = {} as Request;
    const res = { json: jest.fn() } as unknown as Response;

    await getTeams(req, res);

    expect(prismaMock.team.findMany).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      data: []
    });
  });

  it("should return a 500 error if the database call fails", async () => {
    const mockError = new Error("Database error");

    prismaMock.team.findMany.mockRejectedValue(mockError);
    prismaMock.user.findUnique.mockRejectedValue(mockError);

    const req = {} as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

    await getTeams(req, res);

    expect(prismaMock.team.findMany).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: `Error retrieving teams: ${mockError.message}`,
    });
  });
});
