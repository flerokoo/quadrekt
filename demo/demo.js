var packer = require("../dist/quadrekt");
var fs = require("fs");
var pureimage = require("pureimage");

var rects = [];

for (var i = 0; i < 10; i++) {
    rects.push({
        width: Math.random() * 200 + 10,
        height: Math.random() * 200 + 10
    });
}

for (i = 0; i < 200; i++) {
    rects.push({
        width: Math.random() * 20 + 10,
        height: Math.random() * 20 + 10
    });
}

console.time("packing");
packer(rects, { maxWidth: 512, powerOfTwo: false }).then(result => {

    console.timeEnd("packing");
    console.log("result total size:", result.totalWidth, result.totalHeight);

    var getRandomColor = function () {
        return "rgba("
            + Math.round(Math.random() * 255) + ","
            + Math.round(Math.random() * 255) + ","
            + Math.round(Math.random() * 255) + ", 1)";
    };

    var img = pureimage.make(result.totalWidth, result.totalHeight);
    var ctx = img.getContext("2d");

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, result.totalWidth, result.totalHeight);

    console.log("drawing packed rects...");
    for (var i = 0; i < rects.length; i++) {
        var rect = result.rects[i];
        ctx.fillStyle = getRandomColor();
        ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    }

    console.log("saving to disk...");
    pureimage.encodePNGToStream(img, fs.createWriteStream("./demo/packed.png")).then(() => {
        console.log("done, check demo/packed.png");
    }).catch(e => {
        console.error(e);
    });

});