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
const teamController_1 = require("../controllers/teamController"); // Update with correct controller path
// Reset mocks before each test
beforeEach(() => {
    jest.clearAllMocks();
});
// Test for getTeams
describe("getTeams", () => {
    it("should return a list of teams with usernames for productOwner and projectManager", () => __awaiter(void 0, void 0, void 0, function* () {
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
        prisma_1.default.team.findMany.mockResolvedValue(mockTeams);
        prisma_1.default.user.findUnique.mockImplementation((args) => {
            return mockUsers.find((user) => user.userId === args.where.userId);
        });
        const req = {};
        const res = { json: jest.fn() };
        yield (0, teamController_1.getTeams)(req, res);
        const expectedTeamsWithUsernames = [
            Object.assign(Object.assign({}, mockTeams[0]), { productOwnerUsername: "user1", projectManagerUsername: "user2" }),
            Object.assign(Object.assign({}, mockTeams[1]), { productOwnerUsername: "user3", projectManagerUsername: "user4" }),
        ];
        expect(prisma_1.default.team.findMany).toHaveBeenCalledTimes(1);
        expect(prisma_1.default.user.findUnique).toHaveBeenCalledTimes(4);
        expect(res.json).toHaveBeenCalledWith(expectedTeamsWithUsernames);
    }));
    it("should return an empty array when no teams exist", () => __awaiter(void 0, void 0, void 0, function* () {
        prisma_1.default.team.findMany.mockResolvedValue([]);
        const req = {};
        const res = { json: jest.fn() };
        yield (0, teamController_1.getTeams)(req, res);
        expect(prisma_1.default.team.findMany).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith([]);
    }));
    it("should return a 500 error if the database call fails", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockError = new Error("Database error");
        prisma_1.default.team.findMany.mockRejectedValue(mockError);
        prisma_1.default.user.findUnique.mockRejectedValue(mockError);
        const req = {};
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        yield (0, teamController_1.getTeams)(req, res);
        expect(prisma_1.default.team.findMany).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: `Error retrieving teams: ${mockError.message}`,
        });
    }));
});
