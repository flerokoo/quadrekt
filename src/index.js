
let toPot = num => Math.pow(2, Math.ceil(Math.log(num) / Math.log(2)));

let getNewLeaf = (data, x, y, width, height) => ({
    data, x, y, width, height,
    rightChild: null,
    bottomChild: null,
    parent: null,
    parentType: null
});

let fitsRight = (newLeaf, targetLeaf, maxWidth) => {
    return targetLeaf.x + targetLeaf.width + newLeaf.width <= maxWidth
        && targetLeaf.height >= newLeaf.height;
}

let fitsBottom = (newLeaf, targetLeaf, maxWidth) => {
    let cur = targetLeaf;
    let acc = 0;
    let total = 0;
    
    while (cur.parent !== null) {        
        acc += cur.height;
        if (cur.parentType === 'left') {                
            total = cur.parent.height;
            break;
        }
        cur = cur.parent;
    }   

    return (targetLeaf.parent === null || targetLeaf.x === 0 || total - acc >= newLeaf.height)
        && targetLeaf.x + newLeaf.width <= maxWidth;
}

let findPlace = (leaf, newLeaf, maxWidth) => {
    let found = false;

    if (leaf.rightChild === null) {
        if (fitsRight(newLeaf, leaf, maxWidth)) {
            newLeaf.x = leaf.x + leaf.width;
            newLeaf.y = leaf.y;
            newLeaf.parent = leaf;
            newLeaf.parentType = "left";
            leaf.rightChild = newLeaf;
            found = true;
        } 
    } else {
        found = findPlace(leaf.rightChild, newLeaf, maxWidth);
    }

    if (found === false) {
        if (leaf.bottomChild === null) {
            if (fitsBottom(newLeaf, leaf, maxWidth)) {
                newLeaf.x = leaf.x;
                newLeaf.y = leaf.y + leaf.height;
                newLeaf.parent = leaf;
                newLeaf.parentType = "top";
                leaf.bottomChild = newLeaf;
                found = true;
            } 
        } else {
            found = findPlace(leaf.bottomChild, newLeaf, maxWidth);
        }
    }       

    return found;
}

let packRects = (rects, opts) => {
    // TODO typecheck
    opts = opts || {};

    let maxWidth = opts.maxWidth || 2048;    

    rects.sort((a, b) => b.height - a.height);

    let root = null;
    let leafs = [];

    let addRect = (width, height, data) => {
        var leaf = getNewLeaf(data, 0, 0, width, height);
        if (root === null) {
            root = leaf
        } else {
            findPlace(root, leaf, maxWidth);
        }
        leafs.push(leaf);
    }

    for (var i = 0; i < rects.length; i++) {
        let { width, height, data } = rects[i];
        addRect(width, height, data);
    }

    

    let totalWidth = leafs.reduce((prev, cur) => Math.max(prev, cur.x + cur.width), 0);
    let totalHeight = leafs.reduce((prev, cur) => Math.max(prev, cur.y + cur.height), 0);


    if (opts.powerOfTwo !== false) {
        totalWidth = toPot(totalWidth);
        totalHeight = toPot(totalHeight);
    }

    return {
        rects: leafs,
        totalWidth,
        totalHeight
    };
}

export default packRects;

// var value = packRects([
//     { width: 100, height: 100 },
//     { width: 50, height: 10 },
//     { width: 40, height: 20 },
// ])

// console.log(value.map(a => {
//     return { x: a.x, y: a.y, w: a.width, h: a.height };
// }));



