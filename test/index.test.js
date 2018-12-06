const module = require("../src/index");

const fitsRight = module.__get__("fitsRight");
describe("fitsRight", () => {
    it("should return false when given newLeaf exceeds maxWidth when placed right to targetLeaf");

    it("should return true when given newLeaf doesn't exceed maxWidth when placed right to targetLeaf");

    it("should return false when newLeaf is higher than targetLeaf");

    it("should return true when newLeaf isn't higher than targetLeaf");
});

const fitsBottom = module.__get__("fitsBottom");
describe("fitsBottom", () => {
    it("should return false when given newLeaf exceeds maxWidth when placed under targetLeaf");

    it("should return true when given newLeaf doesn't exceed maxWidth when placed under targetLeaf");

    it("should return false when given newLeaf exceeds row height when placed under targetLeaf (when targetLeaf is right child");

    it("should return true when given newLeaf doesn't exceed row height when placed under targetLeaf (when targetLeaf is right child");

    it("should return false when given newLeaf exceeds row height when placed under targetLeaf (when targetLeaf is bottom child");
    
    it("should return true when given newLeaf doesn't exceed row height when placed under targetLeaf (when targetLeaf is bottom child");

    it("should return false when given newLeaf exceeds row height when placed under targetLeaf (when targetLeaf's parents are bottom children");

    it("should return true when given newLeaf doesn't exceed row height when placed under targetLeaf (when targetLeaf's parents are bottom children");

    it("should return true when newLeaf does not have a parent and placed at x==0 (root)");
});

const findPlace = module.__get__("findPlace");
describe("findPlace", () => {
    
});

const isRightChild = module.__get__("isRightChild");
describe("isRightChild", () => {

});

describe("packRects", () => {
    
});