import prismaMock from "../__mocks__/prisma";

describe("Simple Test", () => {
    it("should pass", () => {
      expect(true).toBe(true);
    });
  });
  
  test("mock structure", () => {
    console.log(prismaMock.project); 
  });