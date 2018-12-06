var getNewLeaf = function getNewLeaf(data, x, y, width, height) {
  return {
    data: data,
    x: x,
    y: y,
    width: width,
    height: height,
    rightChild: null,
    bottomChild: null,
    parent: null
  };
};

var isRightChild = function isRightChild(leaf) {
  return leaf.parent.rightChild === leaf;
};

var fitsRight = function fitsRight(newLeaf, targetLeaf, maxWidth) {
  return targetLeaf.x + targetLeaf.width + newLeaf.width <= maxWidth && targetLeaf.height >= newLeaf.height;
};

var fitsBottom = function fitsBottom(newLeaf, targetLeaf, maxWidth) {
  var cur = targetLeaf;
  var total = 0; // row height

  var acc = 0; // occupied portion of row height

  while (cur.parent !== null) {
    acc += cur.height; // if (cur.parentType === 'left') {                

    if (isRightChild(cur)) {
      total = cur.parent.height;
      break;
    }

    cur = cur.parent;
  }

  return (targetLeaf.parent === null || targetLeaf.x === 0 || total - acc >= newLeaf.height) && targetLeaf.x + newLeaf.width <= maxWidth;
};
/**
    @param \{{{type}}\} {{name}} {{description}}{{}}
 */


var findPlace = function findPlace(leaf, newLeaf, maxWidth) {
  var found = false;

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


var packRects = function packRects(rects, opts) {
  if (!Array.isArray(rects)) {
    throw new Error("rects should be an array of objects");
  }

  opts = opts || {};
  var maxWidth = typeof opts.maxWidth === "number" ? opts.maxWidth : 2048;
  var rectsPerTick = typeof opts.rectsPerTick === "number" ? opts.rectsPerTick : 50;
  rects.sort(function (a, b) {
    return b.height - a.height;
  });
  var root = null;
  var leaves = [];
  return new Promise(function (resolve, reject) {
    var promise = Promise.resolve();
    var ii = 0;

    var next = function next() {
      if (ii === rects.length) {
        var totalWidth = leaves.reduce(function (prev, cur) {
          return Math.max(prev, cur.x + cur.width);
        }, 0);
        var totalHeight = leaves.reduce(function (prev, cur) {
          return Math.max(prev, cur.y + cur.height);
        }, 0);
        return resolve({
          totalWidth: totalWidth,
          totalHeight: totalHeight,
          rects: leaves
        });
      } else {
        promise = promise.then(function () {
          var n = Math.min(ii + rectsPerTick, rects.length);

          for (; ii < n; ii++) {
            var _rects$ii = rects[ii],
                width = _rects$ii.width,
                height = _rects$ii.height,
                data = _rects$ii.data;

            if (width > maxWidth) {
              reject("Given rect (".concat(width, "x").concat(height, ") is wider than maxWidth"));
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
