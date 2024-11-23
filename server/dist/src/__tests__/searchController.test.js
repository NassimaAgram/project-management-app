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
const searchController_1 = require("../controllers/searchController");
// Reset mocks before each test
beforeEach(() => {
    jest.clearAllMocks();
});
// Test for search
describe("search", () => {
    // Test for search results
    it("should return search results for tasks, projects, and users", () => __awaiter(void 0, void 0, void 0, function* () {
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
        prisma_1.default.task.findMany.mockResolvedValue(mockTasks);
        prisma_1.default.project.findMany.mockResolvedValue(mockProjects);
        prisma_1.default.user.findMany.mockResolvedValue(mockUsers);
        const req = { query: { query: searchQuery } };
        const res = { json: jest.fn() };
        yield (0, searchController_1.search)(req, res);
        expect(prisma_1.default.task.findMany).toHaveBeenCalledWith({
            where: {
                OR: [
                    { title: { contains: searchQuery } },
                    { description: { contains: searchQuery } },
                ],
            },
        });
        expect(prisma_1.default.project.findMany).toHaveBeenCalledWith({
            where: {
                OR: [
                    { name: { contains: searchQuery } },
                    { description: { contains: searchQuery } },
                ],
            },
        });
        expect(prisma_1.default.user.findMany).toHaveBeenCalledWith({
            where: {
                OR: [{ username: { contains: searchQuery } }],
            },
        });
        expect(res.json).toHaveBeenCalledWith({
            tasks: mockTasks,
            projects: mockProjects,
            users: mockUsers,
        });
    }));
    // Test for empty results
    it("should return empty arrays when no results are found", () => __awaiter(void 0, void 0, void 0, function* () {
        const searchQuery = "NonExistentQuery";
        prisma_1.default.task.findMany.mockResolvedValue([]);
        prisma_1.default.project.findMany.mockResolvedValue([]);
        prisma_1.default.user.findMany.mockResolvedValue([]);
        const req = { query: { query: searchQuery } };
        const res = { json: jest.fn() };
        yield (0, searchController_1.search)(req, res);
        expect(prisma_1.default.task.findMany).toHaveBeenCalledWith({
            where: {
                OR: [
                    { title: { contains: searchQuery } },
                    { description: { contains: searchQuery } },
                ],
            },
        });
        expect(prisma_1.default.project.findMany).toHaveBeenCalledWith({
            where: {
                OR: [
                    { name: { contains: searchQuery } },
                    { description: { contains: searchQuery } },
                ],
            },
        });
        expect(prisma_1.default.user.findMany).toHaveBeenCalledWith({
            where: {
                OR: [{ username: { contains: searchQuery } }],
            },
        });
        expect(res.json).toHaveBeenCalledWith({
            tasks: [],
            projects: [],
            users: [],
        });
    }));
});
