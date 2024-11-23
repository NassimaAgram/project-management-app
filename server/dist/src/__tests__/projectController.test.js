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
const projectController_1 = require("../controllers/projectController");
// Reset mocks before each test
beforeEach(() => {
    jest.clearAllMocks();
});
// Test for getProjects
describe("getProjects", () => {
    it("should return a list of projects", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockProjects = [
            { id: 1, name: "Project A", description: "Desc A", startDate: null, endDate: null },
            { id: 2, name: "Project B", description: "Desc B", startDate: null, endDate: null },
        ];
        prisma_1.default.project.findMany.mockResolvedValue(mockProjects);
        const req = {};
        const res = { json: jest.fn() };
        yield (0, projectController_1.getProjects)(req, res);
        expect(prisma_1.default.project.findMany).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith(mockProjects);
    }));
    it("should return an empty array when no projects exist", () => __awaiter(void 0, void 0, void 0, function* () {
        prisma_1.default.project.findMany.mockResolvedValue([]);
        const req = {};
        const res = { json: jest.fn() };
        yield (0, projectController_1.getProjects)(req, res);
        expect(prisma_1.default.project.findMany).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith([]);
    }));
    it("should return a 500 error if the database call fails", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockError = new Error("Database error");
        prisma_1.default.project.findMany.mockRejectedValue(mockError);
        const req = {};
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        yield (0, projectController_1.getProjects)(req, res);
        expect(prisma_1.default.project.findMany).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: `Error retrieving projects: ${mockError.message}`,
        });
    }));
});
// Test for createProject
describe("createProject", () => {
    it("should create a new project and return it", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockNewProject = {
            id: 1,
            name: "Project A",
            description: "Desc A",
            startDate: new Date("2023-01-01"),
            endDate: new Date("2023-12-31"),
        };
        prisma_1.default.project.create.mockResolvedValue(mockNewProject);
        const req = {
            body: {
                name: "Project A",
                description: "Desc A",
                startDate: new Date("2023-01-01"),
                endDate: new Date("2023-12-31"),
            },
        };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        yield (0, projectController_1.createProject)(req, res);
        expect(prisma_1.default.project.create).toHaveBeenCalledWith({
            data: {
                name: "Project A",
                description: "Desc A",
                startDate: new Date("2023-01-01"),
                endDate: new Date("2023-12-31"),
            },
        });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(mockNewProject);
    }));
    it("should return a 500 error if the database call fails", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockError = new Error("Database error");
        prisma_1.default.project.create.mockRejectedValue(mockError);
        const req = {
            body: {
                name: "Project A",
                description: "Desc A",
                startDate: new Date("2023-01-01"),
                endDate: new Date("2023-12-31"),
            },
        };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        yield (0, projectController_1.createProject)(req, res);
        expect(prisma_1.default.project.create).toHaveBeenCalledWith({
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
    }));
});
