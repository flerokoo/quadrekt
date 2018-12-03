var toPot = function toPot(num) {
  return Math.pow(2, Math.ceil(Math.log(num) / Math.log(2)));
};

var getNewLeaf = function getNewLeaf(data, x, y, width, height) {
  return {
    data: data,
    x: x,
    y: y,
    width: width,
    height: height,
    rightChild: null,
    bottomChild: null,
    parent: null,
    parentType: null
  };
};

var fitsRight = function fitsRight(newLeaf, targetLeaf, maxWidth) {
  return targetLeaf.x + targetLeaf.width + newLeaf.width <= maxWidth && targetLeaf.height >= newLeaf.height;
};

var fitsBottom = function fitsBottom(newLeaf, targetLeaf, maxWidth) {
  var cur = targetLeaf;
  var acc = 0;
  var total = 0;

  while (cur.parent !== null) {
    acc += cur.height;

    if (cur.parentType === 'left') {
      total = cur.parent.height;
      break;
    }

    cur = cur.parent;
  }

  return (targetLeaf.parent === null || targetLeaf.x === 0 || total - acc >= newLeaf.height) && targetLeaf.x + newLeaf.width <= maxWidth;
};

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

var packRects = function packRects(rects, opts) {
  // TODO typecheck
  opts = opts || {};
  var maxWidth = opts.maxWidth || 2048;
  rects.sort(function (a, b) {
    return b.height - a.height;
  });
  var root = null;
  var leafs = [];

  var addRect = function addRect(width, height, data) {
    var leaf = getNewLeaf(data, 0, 0, width, height);

    if (root === null) {
      root = leaf;
    } else {
      findPlace(root, leaf, maxWidth);
    }

    leafs.push(leaf);
  };

  for (var i = 0; i < rects.length; i++) {
    var _rects$i = rects[i],
        width = _rects$i.width,
        height = _rects$i.height,
        data = _rects$i.data;
    addRect(width, height, data);
  }

  var totalWidth = leafs.reduce(function (prev, cur) {
    return Math.max(prev, cur.x + cur.width);
  }, 0);
  var totalHeight = leafs.reduce(function (prev, cur) {
    return Math.max(prev, cur.y + cur.height);
  }, 0);

  if (opts.powerOfTwo !== false) {
    totalWidth = toPot(totalWidth);
    totalHeight = toPot(totalHeight);
  }

  return {
    rects: leafs,
    totalWidth: totalWidth,
    totalHeight: totalHeight
  };
};
//     { width: 100, height: 100 },
//     { width: 50, height: 10 },
//     { width: 40, height: 20 },
// ])
// console.log(value.map(a => {
//     return { x: a.x, y: a.y, w: a.width, h: a.height };
// }));

export default packRects;
