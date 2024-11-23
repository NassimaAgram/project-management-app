"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Mock the PrismaClient constructor and the methods on it
const prismaMock = {
    task: {
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    },
    project: {
        findMany: jest.fn(),
        create: jest.fn(),
    },
    user: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
    },
    team: {
        findMany: jest.fn(),
    },
};
jest.mock("@prisma/client", () => {
    return {
        PrismaClient: jest.fn(() => prismaMock), // Return our mock when PrismaClient is instantiated
    };
});
exports.default = prismaMock;
