var packer = require("../dist/rect-pack-async");


var rects = [];

for (var i = 0; i < 1000; i++) {
    rect = {
        width: Math.random() * 200 + 20,
        height: Math.random() * 200 + 20
    }
    rects.push(rect);
}

console.time("pack")
var result = packer(rects);
console.timeEnd("pack");

console.log(result.totalWidth, result.totalHeight)