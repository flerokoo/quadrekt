const module = require('../src/index');

const toPot = module.__get__("toPot");
describe("toPot", () => {
    it("should ceil 3 to nearest power of two (4)", () => {
        expect(toPot(3)).toEqual(4);
    })

    it("should ceil 162 to nearest power of two (256)", () => {
        expect(toPot(3)).toEqual(4);
    })
});

const fitsRight = module.__get__("fitsRight");
describe("fitsRight", () => {
    
})

