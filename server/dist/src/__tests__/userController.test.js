"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../__mocks__/prisma"));
const userController_1 = require("../controllers/userController");
// Reset mocks before each test
beforeEach(() => {
    jest.clearAllMocks();
});
// Test for getUsers
describe("getUsers", () => {
    it("should return a list of users", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockUsers = [
            { id: 1, username: "user1", clerkId: "clerkId1", profilePictureUrl: "i1.jpg", teamId: 1 },
            { id: 2, username: "user2", clerkId: "clerkId2", profilePictureUrl: "i2.jpg", teamId: 2 },
        ];
        prisma_1.default.user.findMany.mockResolvedValue(mockUsers);
        const req = {};
        const res = { json: jest.fn() };
        yield (0, userController_1.getUsers)(req, res);
        expect(prisma_1.default.user.findMany).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith(mockUsers);
    }));
    it("should return an empty array when no users exist", () => __awaiter(void 0, void 0, void 0, function* () {
        prisma_1.default.user.findMany.mockResolvedValue([]);
        const req = {};
        const res = { json: jest.fn() };
        yield (0, userController_1.getUsers)(req, res);
        expect(prisma_1.default.user.findMany).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith([]);
    }));
    it("should return a 500 error if the database call fails", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockError = new Error("Database error");
        prisma_1.default.user.findMany.mockRejectedValue(mockError);
        const req = {};
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        yield (0, userController_1.getUsers)(req, res);
        expect(prisma_1.default.user.findMany).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: `Error retrieving users: ${mockError.message}`,
        });
    }));
});
// Test for getUser
describe("getUser", () => {
    it("should return a user by clerkId", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockUser = { id: 1, username: "user1", clerkId: "clerkId1", profilePictureUrl: "i1.jpg", teamId: 1 };
        prisma_1.default.user.findUnique.mockResolvedValue(mockUser);
        const req = { params: { clerkId: "clerkId1" } };
        const res = { json: jest.fn() };
        yield (0, userController_1.getUser)(req, res);
        expect(prisma_1.default.user.findUnique).toHaveBeenCalledWith({
            where: { clerkId: "clerkId1" },
        });
        expect(res.json).toHaveBeenCalledWith(mockUser);
    }));
    it("should return a 500 error if the database call fails", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockError = new Error("Database error");
        prisma_1.default.user.findUnique.mockRejectedValue(mockError);
        const req = { params: { clerkId: "clerkId1" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        yield (0, userController_1.getUser)(req, res);
        expect(prisma_1.default.user.findUnique).toHaveBeenCalledWith({
            where: { clerkId: "clerkId1" },
        });
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: `Error retrieving user: ${mockError.message}`,
        });
    }));
});
// Test for postUser
describe("postUser", () => {
    it("should create a new user and return it", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockNewUser = {
            id: 1,
            username: "user1",
            clerkId: "clerkId1",
            profilePictureUrl: "i1.jpg",
            teamId: 1,
        };
        prisma_1.default.user.create.mockResolvedValue(mockNewUser);
        const req = {
            body: {
                username: "user1",
                clerkId: "clerkId1",
                profilePictureUrl: "i1.jpg",
                teamId: 1,
            },
        };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        yield (0, userController_1.postUser)(req, res);
        expect(prisma_1.default.user.create).toHaveBeenCalledWith({
            data: {
                username: "user1",
                clerkId: "clerkId1",
                profilePictureUrl: "i1.jpg",
                teamId: 1,
            },
        });
        expect(res.json).toHaveBeenCalledWith({
            message: "User Created Successfully",
            newUser: mockNewUser,
        });
    }));
    it("should return a 500 error if the database call fails", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockError = new Error("Database error");
        prisma_1.default.user.create.mockRejectedValue(mockError);
        const req = {
            body: {
                username: "user1",
                clerkId: "clerkId1",
                profilePictureUrl: "i1.jpg",
                teamId: 1,
            },
        };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        yield (0, userController_1.postUser)(req, res);
        expect(prisma_1.default.user.create).toHaveBeenCalledWith({
            data: {
                username: "user1",
                clerkId: "clerkId1",
                profilePictureUrl: "i1.jpg",
                teamId: 1,
            },
        });
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: `Error retrieving users: ${mockError.message}`,
        });
    }));
});
