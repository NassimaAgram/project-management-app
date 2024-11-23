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
const prisma_1 = __importDefault(require("../__mocks__/prisma")); // Import mocked Prisma client
const taskController_1 = require("../controllers/taskController"); // Import your task controller functions
// Reset mocks before each test
beforeEach(() => {
    jest.clearAllMocks();
});
// Test for getTasks
describe("getTasks", () => {
    it("should return a list of tasks", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockTasks = [
            { id: 1, title: "Task A", description: "Description A", status: "Open", projectId: 1, authorUserId: 1, assignedUserId: 2 },
            { id: 2, title: "Task B", description: "Description B", status: "In Progress", projectId: 1, authorUserId: 1, assignedUserId: 2 },
        ];
        prisma_1.default.task.findMany.mockResolvedValue(mockTasks);
        const req = { query: { projectId: "1" } };
        const res = { json: jest.fn() };
        yield (0, taskController_1.getTasks)(req, res);
        expect(prisma_1.default.task.findMany).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith(mockTasks);
    }));
    it("should return an empty array when no tasks exist", () => __awaiter(void 0, void 0, void 0, function* () {
        prisma_1.default.task.findMany.mockResolvedValue([]);
        const req = { query: { projectId: "1" } };
        const res = { json: jest.fn() };
        yield (0, taskController_1.getTasks)(req, res);
        expect(prisma_1.default.task.findMany).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith([]);
    }));
    it("should return a 500 error if the database call fails", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockError = new Error("Database error");
        prisma_1.default.task.findMany.mockRejectedValue(mockError);
        const req = { query: { projectId: "1" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        yield (0, taskController_1.getTasks)(req, res);
        expect(prisma_1.default.task.findMany).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: `Error retrieving tasks: ${mockError.message}`,
        });
    }));
});
// Test for createTask
describe("createTask", () => {
    it("should create a new task and return it", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockNewTask = {
            id: 1,
            title: "Task A",
            description: "Description A",
            status: "Open",
            projectId: 1,
            authorUserId: 1,
            assignedUserId: 2,
        };
        prisma_1.default.task.create.mockResolvedValue(mockNewTask);
        const req = {
            body: {
                title: "Task A",
                description: "Description A",
                status: "Open",
                projectId: 1,
                authorUserId: 1,
                assignedUserId: 2,
            },
        };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        yield (0, taskController_1.createTask)(req, res);
        expect(prisma_1.default.task.create).toHaveBeenCalledWith({
            data: {
                title: "Task A",
                description: "Description A",
                status: "Open",
                projectId: 1,
                authorUserId: 1,
                assignedUserId: 2,
            },
        });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(mockNewTask);
    }));
    it("should return a 500 error if the database call fails", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockError = new Error("Database error");
        prisma_1.default.task.create.mockRejectedValue(mockError);
        const req = {
            body: {
                title: "Task A",
                description: "Description A",
                status: "Open",
                projectId: 1,
                authorUserId: 1,
                assignedUserId: 2,
            },
        };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        yield (0, taskController_1.createTask)(req, res);
        expect(prisma_1.default.task.create).toHaveBeenCalledWith({
            data: {
                title: "Task A",
                description: "Description A",
                status: "Open",
                projectId: 1,
                authorUserId: 1,
                assignedUserId: 2,
            },
        });
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: `Error creating a task: ${mockError.message}`,
        });
    }));
});
// Test for updateTaskStatus
describe("updateTaskStatus", () => {
    it("should update the task status and return the updated task", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockUpdatedTask = {
            id: 1,
            title: "Task A",
            description: "Description A",
            status: "Completed",
            projectId: 1,
            authorUserId: 1,
            assignedUserId: 2,
        };
        prisma_1.default.task.update.mockResolvedValue(mockUpdatedTask);
        const req = { params: { taskId: "1" }, body: { status: "Completed" } };
        const res = { json: jest.fn() };
        yield (0, taskController_1.updateTaskStatus)(req, res);
        expect(prisma_1.default.task.update).toHaveBeenCalledWith({
            where: { id: 1 },
            data: { status: "Completed" },
        });
        expect(res.json).toHaveBeenCalledWith(mockUpdatedTask);
    }));
    it("should return a 500 error if the database call fails", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockError = new Error("Database error");
        prisma_1.default.task.update.mockRejectedValue(mockError);
        const req = { params: { taskId: "1" }, body: { status: "Completed" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        yield (0, taskController_1.updateTaskStatus)(req, res);
        expect(prisma_1.default.task.update).toHaveBeenCalledWith({
            where: { id: 1 },
            data: { status: "Completed" },
        });
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: `Error updating task: ${mockError.message}`,
        });
    }));
});
// Test for getUserTasks
describe("getUserTasks", () => {
    it("should return a list of tasks for a user", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockUserTasks = [
            { id: 1, title: "Task A", description: "Description A", status: "Open", authorUserId: 1, assignedUserId: 2 },
            { id: 2, title: "Task B", description: "Description B", status: "In Progress", authorUserId: 1, assignedUserId: 2 },
        ];
        prisma_1.default.task.findMany.mockResolvedValue(mockUserTasks);
        const req = { params: { userId: "1" } };
        const res = { json: jest.fn() };
        yield (0, taskController_1.getUserTasks)(req, res);
        expect(prisma_1.default.task.findMany).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith(mockUserTasks);
    }));
    it("should return an empty array when no tasks are assigned to the user", () => __awaiter(void 0, void 0, void 0, function* () {
        prisma_1.default.task.findMany.mockResolvedValue([]);
        const req = { params: { userId: "1" } };
        const res = { json: jest.fn() };
        yield (0, taskController_1.getUserTasks)(req, res);
        expect(prisma_1.default.task.findMany).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith([]);
    }));
    it("should return a 500 error if the database call fails", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockError = new Error("Database error");
        prisma_1.default.task.findMany.mockRejectedValue(mockError);
        const req = { params: { userId: "1" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        yield (0, taskController_1.getUserTasks)(req, res);
        expect(prisma_1.default.task.findMany).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: `Error retrieving user's tasks: ${mockError.message}`,
        });
    }));
});
