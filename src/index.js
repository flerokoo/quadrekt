
let getNewLeaf = (data, x, y, width, height) => ({
    data, x, y, width, height,
    rightChild: null,
    bottomChild: null,
    parent: null
});

let isRightChild = leaf => leaf.parent.rightChild === leaf;

let fitsRight = (newLeaf, targetLeaf, maxWidth) => {
    return targetLeaf.x + targetLeaf.width + newLeaf.width <= maxWidth
        && targetLeaf.height >= newLeaf.height;
};

let fitsBottom = (newLeaf, targetLeaf, maxWidth) => {
    let cur = targetLeaf;
    let total = 0; // row height
    let acc = 0; // occupied portion of row height
    
    while (cur.parent !== null) {
        acc += cur.height;
        // if (cur.parentType === 'left') {                
        if (isRightChild(cur)) {
            total = cur.parent.height;
            break;
        }
        cur = cur.parent;
    }

    return (targetLeaf.parent === null || targetLeaf.x === 0 || total - acc >= newLeaf.height)
        && targetLeaf.x + newLeaf.width <= maxWidth;
};

/**
    @param \{{{type}}\} {{name}} {{description}}{{}}
 */
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
};

/**
 * Packs given rectangles to a bigger rectangle
 *
 * @param {Object[]} rects Array containing objects, representing rects
 * @param {number} rects[].width Width of this rect
 * @param {number} rects[].height Height of this rect
 * @param {number} rects[].data Optional data to identify rects by (can be just a number)
 * @param {Object} opts Optional object with options
 * @param {number} opts.maxWidth Width of the target rect (to which other rects will be packed)
 * @param {number} opts.rectsPerTick Maximum amount of rects packed during this tick
 * @returns {Promise} Promise object, that resolves to {rects, totalWidth, totalHeight} 
 */
let packRects = (rects, opts) => {

    if (!Array.isArray(rects)) {
        throw new Error("rects should be an array of objects");
    }

    opts = opts || {};

    let maxWidth = typeof opts.maxWidth === "number" ? opts.maxWidth : 2048;
    let rectsPerTick = typeof opts.rectsPerTick === "number" ? opts.rectsPerTick : 50;

    rects.sort((a, b) => b.height - a.height);

    let root = null;
    let leaves = [];

    return new Promise((resolve, reject) => {

        let promise = Promise.resolve();
        let ii = 0;

        let next = () => {
            
            if (ii === rects.length) {
                let totalWidth = leaves.reduce((prev, cur) => Math.max(prev, cur.x + cur.width), 0);
                let totalHeight = leaves.reduce((prev, cur) => Math.max(prev, cur.y + cur.height), 0);
                return resolve({
                    totalWidth, totalHeight,
                    rects: leaves
                });
            } else {
                promise = promise.then(() => {
                    let n = Math.min(ii + rectsPerTick, rects.length);
                    for (; ii < n; ii++) {
                        let { width, height, data } = rects[ii];

                        if (width > maxWidth) {
                            reject(`Given rect (${width}x${height}) is wider than maxWidth`);
                        }

                        var leaf = getNewLeaf(data, 0, 0, width, height);

                        if (root === null) {
                            root = leaf;
                        } else {
                            findPlace(root, leaf, maxWidth);
                        }

                        leaves.push(leaf);
                    }

                    next();
                });
            }
        };

        next();

    });
};

export default packRects;
