import prismaMock from "../__mocks__/prisma";
import { getUsers, getUser, postUser } from "../controllers/userController";
import { Request, Response } from "express";

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

// Test for getUsers
describe("getUsers", () => {
  it("should return a list of users", async () => {
    const mockUsers = [
      { id: 1, username: "user1", clerkId: "1", profilePictureUrl: "i1.jpg", teamId: 1 },
      { id: 2, username: "user2", clerkId: "2", profilePictureUrl: "i2.jpg", teamId: 2 },
    ];

    prismaMock.user.findMany.mockResolvedValue(mockUsers);

    const req = {} as Request;
    const res = { json: jest.fn() } as unknown as Response;

    await getUsers(req, res);

    expect(prismaMock.user.findMany).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      data: mockUsers,
    });
  });

  it("should return an empty array when no users exist", async () => {
    prismaMock.user.findMany.mockResolvedValue([]);

    const req = {} as Request;
    const res = { json: jest.fn() } as unknown as Response;

    await getUsers(req, res);

    expect(prismaMock.user.findMany).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      data: [],
    });
  });

  it("should return a 500 error if the database call fails", async () => {
    const mockError = new Error("Database error");

    prismaMock.user.findMany.mockRejectedValue(mockError);

    const req = {} as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

    await getUsers(req, res);

    expect(prismaMock.user.findMany).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: `Error retrieving users: ${mockError.message}`,
    });
  });
});

// Test for getUser
describe("getUser", () => {
  it("should return a user by clerkId", async () => {
    const mockUser = { id: 1, username: "user1", clerkId: "1", profilePictureUrl: "i1.jpg", teamId: 1 };

    prismaMock.user.findUnique.mockResolvedValue(mockUser);

    const req = { params: { clerkId: "1" } } as unknown as Request;
    const res = { json: jest.fn() } as unknown as Response;

    await getUser(req, res);

    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { clerkId: "1" },
    });
    expect(res.json).toHaveBeenCalledWith({
      data: mockUser,
    });
  });

  it("should return a 500 error if the database call fails", async () => {
    const mockError = new Error("Database error");

    prismaMock.user.findUnique.mockRejectedValue(mockError);

    const req = { params: { clerkId: "1" } } as unknown as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

    await getUser(req, res);

    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { clerkId: "1" },
    });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: `Error retrieving user: ${mockError.message}`,
    });
  });
});

// Test for postUser
describe('postUser', () => {

  it('should return a 500 error if the database call fails', async () => {
    const req = {
      body: {
        clerkId: '1',
        username: 'user1',
        email: 'user1@example.com',
        profilePictureUrl: 'i1.jpg',
        teamId: 1,
      },
    } as any;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as any;

    // Simulez une erreur lors de la création de l'utilisateur
    prismaMock.user.create.mockRejectedValue(new Error('Database error'));

    await postUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Error retrieving users: Database error',
    });
  });
});