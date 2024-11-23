"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../__mocks__/prisma"));
describe("Simple Test", () => {
    it("should pass", () => {
        expect(true).toBe(true);
    });
});
test("mock structure", () => {
    console.log(prisma_1.default.project);
});
