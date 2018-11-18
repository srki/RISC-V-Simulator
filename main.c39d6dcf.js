// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"util/Graphics.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Graphics =
/** @class */
function () {
  function Graphics(canvas, width, height) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.width = width;
    this.height = height;

    if (canvas.style.width == undefined || canvas.style.height == undefined) {
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      console.warn("Canvas width or height undefined");
    }
  }

  Graphics.prototype.rescale = function () {
    var canvasWidth = this.canvas.clientWidth;
    var canvasHeight = this.canvas.clientHeight;
    /* Added support for Retina display */

    this.canvas.width = canvasWidth * window.devicePixelRatio;
    this.canvas.height = canvasHeight * window.devicePixelRatio;
    var scale = canvasWidth / canvasHeight > this.width / this.height ? canvasHeight / this.height : canvasWidth / this.width;
    var rescaleOffsetX = (canvasWidth - scale * this.width) / 2;
    var rescaleOffsetY = (canvasHeight - scale * this.height) / 2;
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.translate(rescaleOffsetX, rescaleOffsetY);
    this.ctx.scale(scale * window.devicePixelRatio, scale * window.devicePixelRatio);
  };

  Graphics.prototype.clear = function (color) {
    this.ctx.save();
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.restore();
  };

  Graphics.prototype.drawLine = function (x1, y1, x2, y2, color, lineWidth) {
    if (lineWidth === void 0) {
      lineWidth = 2;
    }

    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
  };

  Graphics.prototype.drawPath = function (path, strokeStyle, lineWidth) {
    if (lineWidth === void 0) {
      lineWidth = 2;
    }

    this.ctx.strokeStyle = strokeStyle;
    this.ctx.lineWidth = lineWidth;
    this.ctx.beginPath();
    this.ctx.moveTo(path[0][0], path[0][1]);

    for (var i = 1; i < path.length; i++) {
      this.ctx.lineTo(path[i][0], path[i][1]);
    }

    this.ctx.stroke();
  };

  Graphics.prototype.fillRect = function (x, y, w, h, fillStyle, strokeStyle, lineWidth) {
    if (lineWidth === void 0) {
      lineWidth = 2;
    }

    this.fillPolygon([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], fillStyle, strokeStyle, lineWidth);
  };

  Graphics.prototype.fillPolygon = function (point, fillStyle, strokeStyle, lineWidth) {
    if (lineWidth === void 0) {
      lineWidth = 2;
    }

    this.ctx.fillStyle = fillStyle;
    this.ctx.strokeStyle = strokeStyle;
    this.ctx.lineWidth = lineWidth;
    this.ctx.beginPath();
    this.ctx.moveTo(point[0][0], point[0][1]);

    for (var i = 1; i < point.length; i++) {
      this.ctx.lineTo(point[i][0], point[i][1]);
    }

    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();
  };

  Graphics.prototype.fillCircle = function (x, y, r, fillStyle) {
    this.ctx.fillStyle = fillStyle;
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, 2 * Math.PI);
    this.ctx.fill();
  };

  Graphics.prototype.drawText = function (x, y, text, fontColor, fontSize) {
    this.ctx.font = fontSize + "px Monospace";
    this.ctx.fillStyle = fontColor;
    this.ctx.fillText(text, x, y);
  };

  Graphics.prototype.drawTextCentered = function (x, y, width, text, fontColor, fontSize) {
    this.ctx.font = fontSize + "px Monospace";
    this.ctx.fillStyle = fontColor;
    var textWidth = this.ctx.measureText(text).width;
    this.ctx.fillText(text, x + (width - textWidth) / 2, y);
  };

  Graphics.addOffset = function (points, xOffset, yOffset) {
    var updated = [];

    for (var idx in points) {
      updated.push([xOffset + points[idx][0], yOffset + points[idx][1]]);
    }

    return updated;
  };

  return Graphics;
}();

exports.default = Graphics;
},{}],"components/Component.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Component =
/** @class */
function () {
  function Component(x, y) {
    this.x = x;
    this.y = y;
    this.id = Component.cnt++;
  }

  Component.prototype.refresh = function () {};

  Component.prototype.forwardSignal = function (signaler, value) {};

  Component.prototype.mark = function (caller) {};

  Component.prototype.onFallingEdge = function () {};

  Component.prototype.onRisingEdge = function () {};

  Component.cnt = 0;
  return Component;
}();

exports.default = Component;
},{}],"util/Config.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Config =
/** @class */
function () {
  function Config() {}

  Config.backgroundColor = "#ffffff";
  Config.elementFillColor = "#b1e5e0";
  Config.elementStrokeColor = "#000000";
  Config.memoryFillColor = "#fffed0";
  Config.memoryStrokeColor = "#000000";
  Config.lineColor = "#000000";
  Config.signalColor = "#FF0000";
  Config.fontColor = "#000000";
  Config.readFontColor = "#0000FF";
  Config.writeFontColor = "#FF0000";
  Config.fontSize = 20;
  return Config;
}();

exports.default = Config;
},{}],"util/Value.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Value =
/** @class */
function () {
  function Value(bitValue, numBits) {
    if (bitValue.length > numBits) {
      console.log("BitValue is too long");
    }

    this.numBits = numBits;
    this.bitValue = this.padWith(bitValue, "0", numBits);
  }

  Value.mod = function (n, m) {
    return (n % m + m) % m;
  };

  Value.fromUnsignedInt = function (val, num_bits) {
    if (num_bits === void 0) {
      num_bits = 32;
    }

    return new Value(Value.mod(val, Math.pow(2, num_bits)).toString(2), num_bits);
  };

  Value.fromSignedInt = function (val, numBits) {
    if (numBits === void 0) {
      numBits = 32;
    }

    return new Value((val < 0 ? val + (1 << numBits) : val).toString(2), numBits);
  };

  Value.prototype.asUnsignedInt = function () {
    return parseInt(this.bitValue, 2);
  };

  Value.prototype.asSignedInt = function () {
    var str = this.padWith(this.bitValue, "0", this.numBits);

    if (str[0] == "0") {
      return parseInt(this.bitValue, 2);
    }

    var flippedStr = "";

    for (var i = 1; i < str.length; i++) {
      flippedStr += str[i] == "1" ? "0" : "1";
    }

    return -parseInt(flippedStr, 2) - 1;
  };

  Value.prototype.asHexString = function () {
    var str = this.asUnsignedInt().toString(16);

    while (str.length < this.numBits / 4) {
      str = "0" + str;
    }

    return "0x" + str.toUpperCase();
  };

  Value.prototype.asBinaryString = function () {
    return this.bitValue;
  };

  Value.prototype.asShortHexString = function () {
    return this.asUnsignedInt().toString(16).toUpperCase();
  };

  Value.prototype.signExtend = function (numBits) {
    return new Value(this.padWith(this.bitValue, this.bitValue[0], numBits), numBits);
  };

  Value.prototype.getNumBits = function () {
    return this.numBits;
  };

  Value.prototype.getByteBinary = function (byteIdx) {
    if (this.numBits != 32) {
      console.log("Error");
      return null;
    }

    return this.asBinaryString().substr((3 - byteIdx) * 8, 8);
  };

  Value.prototype.writeByte = function (byteIdx, byte) {
    if (this.numBits != 32) {
      console.log("Error");
      return null;
    }

    byteIdx = 3 - byteIdx;
    var str = this.asBinaryString();
    str = str.substring(0, byteIdx * 8) + byte + str.substr((byteIdx + 1) * 8);
    return new Value(str, 32);
  };

  Value.prototype.padWith = function (str, padValue, length) {
    while (str.length < length) {
      str = padValue + str;
    }

    return str;
  }; // TODO: check if the implementations are correct


  Value.add = function (lhs, rhs) {
    return Value.fromUnsignedInt(lhs.asUnsignedInt() + rhs.asUnsignedInt(), 32);
  };

  Value.sub = function (lhs, rhs) {
    return Value.fromUnsignedInt(lhs.asUnsignedInt() - rhs.asUnsignedInt(), 32);
  };

  Value.and = function (lhs, rhs) {
    return Value.fromUnsignedInt(lhs.asUnsignedInt() & rhs.asUnsignedInt(), 32);
  };

  Value.or = function (lhs, rhs) {
    return Value.fromUnsignedInt(lhs.asUnsignedInt() | rhs.asUnsignedInt(), 32);
  };

  Value.xor = function (lhs, rhs) {
    return Value.fromUnsignedInt(lhs.asUnsignedInt() ^ rhs.asUnsignedInt(), 32);
  };

  Value.shiftLeftLogical = function (lhs, rhs) {
    return Value.fromUnsignedInt(lhs.asUnsignedInt() << rhs.asUnsignedInt(), 32);
  };

  Value.shiftRightLogical = function (lhs, rhs) {
    return Value.fromUnsignedInt(lhs.asUnsignedInt() >>> rhs.asUnsignedInt(), 32);
  };

  Value.shiftRightArithmetic = function (lhs, rhs) {
    return Value.fromUnsignedInt(lhs.asUnsignedInt() >> rhs.asUnsignedInt(), 32);
  };

  Value.cmp = function (lhs, rhs, signed) {
    if (lhs.numBits != rhs.numBits) {
      console.error("The nuber of bits do not match");
      return null;
    }

    var a = lhs.asBinaryString();
    var b = rhs.asBinaryString();

    if (signed && a[0] != b[0]) {
      return a[0] == '1' ? -1 : 1;
    }

    for (var i = 0; i < a.length; i++) {
      if (a[i] != b[i]) {
        return a[i] == '0' ? -1 : 1;
      }
    }

    return 0;
  };

  Value.cmpEQ = function (lhs, rhs) {
    return this.cmp(lhs, rhs, false) == 0;
  };

  Value.cmpNE = function (lhs, rhs) {
    return this.cmp(lhs, rhs, false) != 0;
  };

  Value.cmpLT = function (lhs, rhs) {
    return this.cmp(lhs, rhs, true) == -1;
  };

  Value.cmpGE = function (lhs, rhs) {
    return this.cmp(lhs, rhs, true) != -1;
  };

  Value.cmpLTU = function (lhs, rhs) {
    return this.cmp(lhs, rhs, false) == -1;
  };

  Value.cmpGEU = function (lhs, rhs) {
    return this.cmp(lhs, rhs, false) != -1;
  };

  Value.main = function () {// for (let i = -4; i < 4; i++) {
    //     let v = this.fromSignedInt(i, 3);
    //     console.log(v.asBinaryString() + " " + v.asSignedInt() + " " + v.asUnsignedInt());
    // }
    //@formatter:off
    // console.log(this.cmpEQ(new Value(-10, 32), new Value( 10, 32)) == false);
    // console.log(this.cmpEQ(new Value( 10, 32), new Value(-10, 32)) == false);
    // console.log(this.cmpEQ(new Value( 10, 32), new Value( 10, 32)) == true);
    // console.log(this.cmpEQ(new Value(-10, 32), new Value(-10, 32)) == true);
    // console.log(this.cmpEQ(new Value(  9, 32), new Value(-10, 32)) == false);
    // console.log(this.cmpEQ(new Value(  9, 32), new Value( 10, 32)) == false);
    // console.log(this.cmpEQ(new Value( 11, 32), new Value( 10, 32)) == false);
    // console.log(this.cmpEQ(new Value(-11, 32), new Value( 10, 32)) == false);
    //
    // console.log("--");
    //
    // console.log(this.cmpNE(new Value(-10, 32), new Value( 10, 32)) == true);
    // console.log(this.cmpNE(new Value( 10, 32), new Value(-10, 32)) == true);
    // console.log(this.cmpNE(new Value( 10, 32), new Value( 10, 32)) == false);
    // console.log(this.cmpNE(new Value(-10, 32), new Value(-10, 32)) == false);
    // console.log(this.cmpNE(new Value(  9, 32), new Value(-10, 32)) == true);
    // console.log(this.cmpNE(new Value(  9, 32), new Value( 10, 32)) == true);
    // console.log(this.cmpNE(new Value( 11, 32), new Value( 10, 32)) == true);
    // console.log(this.cmpNE(new Value(-11, 32), new Value( 10, 32)) == true);
    //
    // console.log("--");
    //
    // console.log(this.cmpLT(new Value(-10, 32), new Value( 10, 32)) == true);
    // console.log(this.cmpLT(new Value( 10, 32), new Value(-10, 32)) == false);
    // console.log(this.cmpLT(new Value( 10, 32), new Value( 10, 32)) == false);
    // console.log(this.cmpLT(new Value(-10, 32), new Value(-10, 32)) == false);
    // console.log(this.cmpLT(new Value(  9, 32), new Value(-10, 32)) == false);
    // console.log(this.cmpLT(new Value(  9, 32), new Value( 10, 32)) == true);
    // console.log(this.cmpLT(new Value( 11, 32), new Value( 10, 32)) == false);
    // console.log(this.cmpLT(new Value(-11, 32), new Value( 10, 32)) == true);
    //
    // console.log("--");
    //
    // console.log(this.cmpGE(new Value(-10, 32), new Value( 10, 32)) == false);
    // console.log(this.cmpGE(new Value( 10, 32), new Value(-10, 32)) == true);
    // console.log(this.cmpGE(new Value( 10, 32), new Value( 10, 32)) == true);
    // console.log(this.cmpGE(new Value(-10, 32), new Value(-10, 32)) == true);
    // console.log(this.cmpGE(new Value(  9, 32), new Value(-10, 32)) == true);
    // console.log(this.cmpGE(new Value(  9, 32), new Value( 10, 32)) == false);
    // console.log(this.cmpGE(new Value( 11, 32), new Value( 10, 32)) == true);
    // console.log(this.cmpGE(new Value(-11, 32), new Value( 10, 32)) == false);
    //
    // console.log("--");
    //
    // console.log(this.cmpLTU(new Value( 10, 32), new Value( 10, 32)) == false);
    // console.log(this.cmpLTU(new Value(  9, 32), new Value( 10, 32)) == true);
    // console.log(this.cmpLTU(new Value( 11, 32), new Value( 10, 32)) == false);
    //
    // console.log("--");
    //
    // console.log(this.cmpGEU(new Value( 10, 32), new Value( 10, 32)) == true);
    // console.log(this.cmpGEU(new Value(  9, 32), new Value( 10, 32)) == false);
    // console.log(this.cmpGEU(new Value( 11, 32), new Value( 10, 32)) == true);
    //@formatter:on
  };

  Value.HexString = function (s, num_bits) {
    if (num_bits === void 0) {
      num_bits = 32;
    }

    return Value.fromUnsignedInt(parseInt(s, 16), num_bits);
  };

  return Value;
}();

exports.default = Value;
exports.VAL_ZERO_32b = Value.fromUnsignedInt(0, 32);
exports.VAL_ONE_32b = Value.fromUnsignedInt(1, 32);
exports.VAL_TWO_32b = Value.fromUnsignedInt(2, 32);
exports.VAL_THREE_32b = Value.fromUnsignedInt(3, 32);
exports.VAL_MAX_32b = new Value("11111111111111111111111111111111", 32);
exports.VAL_ZERO_1b = Value.fromUnsignedInt(0, 1);
exports.VAL_ZERO_5b = Value.fromUnsignedInt(0, 5);
},{}],"components/ArithmeticLogicUnit.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) {
    if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  }
  result["default"] = mod;
  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Component_1 = __importDefault(require("./Component"));

var Graphics_1 = __importDefault(require("../util/Graphics"));

var Config_1 = __importDefault(require("../util/Config"));

var Value_1 = __importStar(require("../util/Value"));

var ArithmeticLogicUnit =
/** @class */
function (_super) {
  __extends(ArithmeticLogicUnit, _super);

  function ArithmeticLogicUnit(x, y, defaultOp) {
    if (defaultOp === void 0) {
      defaultOp = undefined;
    }

    var _this = _super.call(this, x, y) || this;

    _this._resultNode = null;
    _this._input1Node = null;
    _this._input2Node = null;
    _this._selOpNode = null;
    _this.input1Value = Value_1.VAL_ZERO_32b;
    _this.input2Value = Value_1.VAL_ZERO_1b;
    _this.selOpValue = Value_1.VAL_ZERO_5b;
    _this.defaultOp = defaultOp;

    _this.refresh();

    return _this;
  }

  ArithmeticLogicUnit.prototype.draw = function (g) {
    g.fillPolygon(Graphics_1.default.addOffset([[0, 0], [40, 15], [40, 60], [0, 75], [0, 45], [10, 37.5], [0, 30]], this.x, this.y), Config_1.default.elementFillColor, Config_1.default.elementStrokeColor);
  };

  ArithmeticLogicUnit.prototype.refresh = function () {
    this.input1Value = undefined;
    this.input2Value = undefined;
    this.selOpValue = this.defaultOp;
  };

  ArithmeticLogicUnit.prototype.forwardSignal = function (signaler, value) {
    switch (signaler) {
      case this._input1Node:
        this.input1Value = value;
        break;

      case this._input2Node:
        this.input2Value = value;
        break;

      case this._selOpNode:
        this.selOpValue = value;
        break;
    }

    if (this.input1Value == undefined || this.input2Value == undefined || this.selOpValue == undefined) {
      return;
    }

    var result;

    switch (this.selOpValue) {
      case ArithmeticLogicUnit.ADD:
        {
          result = Value_1.default.add(this.input1Value, this.input2Value);
          break;
        }

      case ArithmeticLogicUnit.SUB:
        {
          result = Value_1.default.sub(this.input1Value, this.input2Value);
          break;
        }

      case ArithmeticLogicUnit.AND:
        {
          result = Value_1.default.and(this.input1Value, this.input2Value);
          break;
        }

      case ArithmeticLogicUnit.OR:
        {
          result = Value_1.default.or(this.input1Value, this.input2Value);
          break;
        }

      case ArithmeticLogicUnit.XOR:
        {
          result = Value_1.default.xor(this.input1Value, this.input2Value);
          break;
        }

      case ArithmeticLogicUnit.SLL:
        {
          result = Value_1.default.shiftLeftLogical(this.input1Value, this.input2Value);
          break;
        }

      case ArithmeticLogicUnit.SRL:
        {
          result = Value_1.default.shiftRightLogical(this.input1Value, this.input2Value);
          break;
        }

      case ArithmeticLogicUnit.SRA:
        {
          result = Value_1.default.shiftRightArithmetic(this.input1Value, this.input2Value);
          break;
        }

      case ArithmeticLogicUnit.SLT:
        {
          // TODO: implement
          break;
        }

      case ArithmeticLogicUnit.SLTU:
        {
          // TODO: implement
          break;
        }

      default:
        {
          console.error("Unknown operation");
          result = Value_1.VAL_ZERO_32b;
        }
    }

    this._resultNode.forwardSignal(this, result);
  };

  ArithmeticLogicUnit.prototype.mark = function (caller) {
    this._input1Node.mark(this);

    this._input2Node.mark(this);

    if (this.defaultOp == null) {
      this._selOpNode.mark(this);
    }
  };

  Object.defineProperty(ArithmeticLogicUnit.prototype, "resultNode", {
    set: function set(node) {
      this._resultNode = node;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ArithmeticLogicUnit.prototype, "input1Node", {
    set: function set(node) {
      this._input1Node = node;
      node.addNeighbour(this);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ArithmeticLogicUnit.prototype, "input2Node", {
    set: function set(node) {
      this._input2Node = node;
      node.addNeighbour(this);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ArithmeticLogicUnit.prototype, "selOpNode", {
    set: function set(node) {
      this._selOpNode = node;
      node.addNeighbour(this);
    },
    enumerable: true,
    configurable: true
  });
  /* @formatter:off */

  ArithmeticLogicUnit.ADD = new Value_1.default("0", 4);
  /* Addition               */

  ArithmeticLogicUnit.SUB = new Value_1.default("1", 4);
  /* Subtraction            */

  ArithmeticLogicUnit.AND = new Value_1.default("2", 4);
  /* Bitwise AND            */

  ArithmeticLogicUnit.OR = new Value_1.default("3", 4);
  /* Bitwise OR             */

  ArithmeticLogicUnit.XOR = new Value_1.default("4", 4);
  /* Bitwise XOR            */

  ArithmeticLogicUnit.SLL = new Value_1.default("5", 4);
  /* Shift Left Logical     */

  ArithmeticLogicUnit.SRL = new Value_1.default("6", 4);
  /* Shift Right Logical    */

  ArithmeticLogicUnit.SRA = new Value_1.default("7", 4);
  /* Shift Right Arithmetic */

  ArithmeticLogicUnit.SLT = new Value_1.default("8", 4);
  /* Shift Right Arithmetic */

  ArithmeticLogicUnit.SLTU = new Value_1.default("9", 4);
  /* Shift Right Arithmetic */

  return ArithmeticLogicUnit;
}(Component_1.default);

exports.default = ArithmeticLogicUnit;
},{"./Component":"components/Component.ts","../util/Graphics":"util/Graphics.ts","../util/Config":"util/Config.ts","../util/Value":"util/Value.ts"}],"components/Register.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Component_1 = __importDefault(require("./Component"));

var Config_1 = __importDefault(require("../util/Config"));

var Value_1 = require("../util/Value");

var RegisterOrientation;

(function (RegisterOrientation) {
  RegisterOrientation[RegisterOrientation["HORIZONTAL"] = 0] = "HORIZONTAL";
  RegisterOrientation[RegisterOrientation["VERTICAL"] = 1] = "VERTICAL";
})(RegisterOrientation = exports.RegisterOrientation || (exports.RegisterOrientation = {}));

var Register =
/** @class */
function (_super) {
  __extends(Register, _super);

  function Register(x, y, orientation) {
    if (orientation === void 0) {
      orientation = RegisterOrientation.HORIZONTAL;
    }

    var _this = _super.call(this, x, y) || this;

    _this._inputNode = null;
    _this._outNode = null;
    _this._writeEnable = null;
    _this.value = Value_1.VAL_ZERO_32b;
    _this.nextValue = undefined;
    _this.orientation = orientation;
    _this.nextValue = undefined;
    return _this;
  }

  Register.prototype.draw = function (g) {
    if (this.orientation == RegisterOrientation.HORIZONTAL) {
      g.fillRect(this.x, this.y, 150, 25, Config_1.default.elementFillColor, Config_1.default.elementStrokeColor);
      g.drawText(this.x + 10, this.y + 21, this.value.asHexString(), Config_1.default.fontColor, Config_1.default.fontSize);
    } else if (this.orientation == RegisterOrientation.VERTICAL) {// TODO: implement
    }
  };

  Register.prototype.refresh = function () {
    if (this.nextValue) {
      this.value = this.nextValue;
    }

    this.nextValue = undefined;
  };

  Register.prototype.onFallingEdge = function () {
    this._outNode.forwardSignal(this, this.value);
  };

  Register.prototype.onRisingEdge = function () {
    if (this._writeEnable && this._writeEnable.value.asUnsignedInt() != 0) {
      this.nextValue = this._inputNode.value;

      this._inputNode.mark(this);
    }
  };

  Object.defineProperty(Register.prototype, "inputNode", {
    set: function set(node) {
      this._inputNode = node;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Register.prototype, "outNode", {
    set: function set(node) {
      this._outNode = node;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Register.prototype, "writeEnable", {
    set: function set(node) {
      this._writeEnable = node;
    },
    enumerable: true,
    configurable: true
  });
  return Register;
}(Component_1.default);

exports.default = Register;
},{"./Component":"components/Component.ts","../util/Config":"util/Config.ts","../util/Value":"util/Value.ts"}],"components/CircutNode.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Component_1 = __importDefault(require("./Component"));

var Config_1 = __importDefault(require("../util/Config"));

var CircuitNode =
/** @class */
function (_super) {
  __extends(CircuitNode, _super);

  function CircuitNode(x, y, defaultValue) {
    if (defaultValue === void 0) {
      defaultValue = undefined;
    }

    var _this = _super.call(this, x, y) || this;

    _this.neighbours = [];
    _this.neighbourNodes = [];
    _this.defaultValue = defaultValue;

    _this.refresh();

    return _this;
  }

  CircuitNode.prototype.draw = function (g) {
    var _this = this; // g.fillCircle(this.x, this.y, 2, Config.signalColor);


    this.neighbourNodes.forEach(function (el) {
      return g.drawLine(_this.x, _this.y, el.x, el.y, el.marked ? Config_1.default.signalColor : Config_1.default.lineColor);
    });
  };

  CircuitNode.prototype.refresh = function () {
    this._value = this.defaultValue;
    this.signaler = undefined;
    this.marked = false;
  };

  CircuitNode.prototype.forwardSignal = function (signaler, value) {
    var _this = this;

    this._value = value;
    this.signaler = signaler;
    this.neighbours.forEach(function (nb) {
      if (nb != signaler) {
        nb.forwardSignal(_this, value);
      }
    });
  };

  CircuitNode.prototype.mark = function (caller) {
    this.marked = true;

    if (this.signaler) {
      this.signaler.mark(this);
    } else {
      console.log("Error");
    }
  };

  CircuitNode.prototype.addNeighbour = function (neighbour) {
    this.neighbours.push(neighbour);

    if (neighbour instanceof CircuitNode) {
      this.neighbourNodes.push(neighbour);
    }
  };

  Object.defineProperty(CircuitNode.prototype, "value", {
    get: function get() {
      return this._value;
    },
    enumerable: true,
    configurable: true
  });
  return CircuitNode;
}(Component_1.default);

exports.default = CircuitNode;
},{"./Component":"components/Component.ts","../util/Config":"util/Config.ts"}],"instructions/InstructionConstants.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var InstructionConstants =
/** @class */
function () {
  function InstructionConstants() {}
  /* @formatter:off */


  InstructionConstants.OP_CODE_ALU = "0110011";
  InstructionConstants.OP_CODE_ALUI = "0010011";
  InstructionConstants.OP_CODE_LW = "0000011";
  InstructionConstants.OP_CODE_SW = "0100011";
  InstructionConstants.OP_CODE_BRANCH = "1100011";
  InstructionConstants.OP_CODE_JAL = "1101111";
  InstructionConstants.OP_CODE_JALR = "1100111";
  /* ALU Functions */

  InstructionConstants.FUNCT_ADD = "0000000000";
  InstructionConstants.FUNCT_SUB = "0100000000";
  InstructionConstants.FUNCT_SLL = "0000000001";
  InstructionConstants.FUNCT_SLT = "0000000010";
  InstructionConstants.FUNCT_SLTU = "0000000011";
  InstructionConstants.FUNCT_XOR = "0000000100";
  InstructionConstants.FUNCT_SRL = "0000000101";
  InstructionConstants.FUNCT_SRA = "0100000101";
  InstructionConstants.FUNCT_OR = "0000000110";
  InstructionConstants.FUNCT_AND = "0000000111";
  /* ALUi Functions */

  InstructionConstants.FUNCT_ADDI = "000";
  InstructionConstants.FUNCT_SLTI = "010";
  InstructionConstants.FUNCT_SLTIU = "011";
  InstructionConstants.FUNCT_XORI = "100";
  InstructionConstants.FUNCT_ORI = "110";
  InstructionConstants.FUNCT_ANDI = "111";
  InstructionConstants.FUNCT_SLLI = "0000000001";
  InstructionConstants.FUNCT_SRLI = "0000000101";
  InstructionConstants.FUNCT_SRAI = "0100000101";
  /* Load Functions */

  InstructionConstants.FUNCT_LB = "000";
  InstructionConstants.FUNCT_LH = "001";
  InstructionConstants.FUNCT_LW = "010";
  InstructionConstants.FUNCT_LBU = "100";
  InstructionConstants.FUNCT_LHU = "101";
  /* Store Functions */

  InstructionConstants.FUNCT_SB = "000";
  InstructionConstants.FUNCT_SH = "001";
  InstructionConstants.FUNCT_SW = "010";
  /* Branch Functions */

  InstructionConstants.FUNCT_BEQ = "000";
  InstructionConstants.FUNCT_BNE = "001";
  InstructionConstants.FUNCT_BLT = "100";
  InstructionConstants.FUNCT_BGE = "101";
  InstructionConstants.FUNCT_BLTU = "110";
  InstructionConstants.FUNCT_BGEU = "111";
  return InstructionConstants;
}();

exports.default = InstructionConstants;
},{}],"instructions/InstructionHelper.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var InstructionHelper =
/** @class */
function () {
  function InstructionHelper() {}

  InstructionHelper.convertAndPad = function (num, len) {
    if (len === void 0) {
      len = 32;
    }

    if (num < 0) {
      num += Math.pow(2, len);
    }

    var str = num.toString(2);

    while (str.length < len) {
      str = "0" + str;
    }

    return str;
  };

  InstructionHelper.toBitString = function (instr) {
    return this.convertAndPad(instr.asUnsignedInt());
  };

  InstructionHelper.getOpCodeStr = function (inst) {
    return this.toBitString(inst).substr(this.INSTR_SIZE - this.OP_CODE_SIZE);
  };

  InstructionHelper.getRd = function (instr) {
    return parseInt(instr.asBinaryString().substr(20, 5), 2);
  };

  InstructionHelper.getRs1 = function (instr) {
    return parseInt(instr.asBinaryString().substr(12, 5), 2);
  };

  InstructionHelper.getRs2 = function (instr) {
    return parseInt(instr.asBinaryString().substr(7, 5), 2);
  };

  InstructionHelper.getImmIType = function (instr) {
    return parseInt(instr.asBinaryString().substr(0, 12), 2);
  };

  InstructionHelper.getImmBType = function (instr) {
    var str = instr.asBinaryString();
    var imm12 = str.substr(0, 1);
    var imm10 = str.substr(1, 6);
    var imm4 = str.substr(20, 4);
    var imm11 = str.substr(24, 1);
    return parseInt(imm12 + imm11 + imm10 + imm4 + "0", 2);
  };

  InstructionHelper.getImmSType = function (instr) {
    var str = instr.asBinaryString();
    var imm11 = str.substr(0, 7);
    var imm4 = str.substr(20, 5);
    return parseInt(imm11 + imm4, 2);
  };

  InstructionHelper.getFuncLType = function (instr) {
    return instr.asBinaryString().substr(17, 3);
  };

  InstructionHelper.getFuncSType = function (instr) {
    return instr.asBinaryString().substr(17, 3);
  };

  InstructionHelper.getFuncBType = function (instr) {
    return instr.asBinaryString().substr(17, 3);
  };

  InstructionHelper.INSTR_SIZE = 32;
  InstructionHelper.OP_CODE_SIZE = 7;
  return InstructionHelper;
}();

exports.default = InstructionHelper;
},{}],"instructions/InstructionDecoder.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var InstructionConstants_1 = __importDefault(require("./InstructionConstants"));

var InstructionHelper_1 = __importDefault(require("./InstructionHelper"));

var InstructionDecoder =
/** @class */
function () {
  function InstructionDecoder() {}

  InstructionDecoder.decode = function (instr) {
    var opCode = InstructionHelper_1.default.getOpCodeStr(instr);

    switch (opCode) {
      case InstructionConstants_1.default.OP_CODE_ALU:
        return this.decodeALU(instr);

      case InstructionConstants_1.default.OP_CODE_ALUI:
        return this.decodeALUI(instr);

      case InstructionConstants_1.default.OP_CODE_LW:
        return this.decodeLW(instr);

      case InstructionConstants_1.default.OP_CODE_SW:
        return this.decodeSW(instr);

      case InstructionConstants_1.default.OP_CODE_BRANCH:
        return this.decodeBRANCH(instr);

      case InstructionConstants_1.default.OP_CODE_JAL:
        return this.decodeJAL(instr);

      case InstructionConstants_1.default.OP_CODE_JALR:
        return this.decodeJALR(instr);

      default:
        // console.error("Unsupported OP Code: " + opCode);
        return instr.asHexString();
    }
  };

  InstructionDecoder.decodeALU = function (instr) {
    var func = instr.asBinaryString().substr(0, 7) + instr.asBinaryString().substr(17, 3);
    var name = "-";

    switch (func) {
      case InstructionConstants_1.default.FUNCT_ADD:
        {
          name = "ADD";
          break;
        }

      case InstructionConstants_1.default.FUNCT_SUB:
        {
          name = "SUB";
          break;
        }

      case InstructionConstants_1.default.FUNCT_SLL:
        {
          name = "SLT";
          break;
        }

      case InstructionConstants_1.default.FUNCT_SLT:
        {
          name = "SLT";
          break;
        }

      case InstructionConstants_1.default.FUNCT_SLTIU:
        {
          name = "SLTU";
          break;
        }

      case InstructionConstants_1.default.FUNCT_XOR:
        {
          name = "XOR";
          break;
        }

      case InstructionConstants_1.default.FUNCT_SRL:
        {
          name = "SRL";
          break;
        }

      case InstructionConstants_1.default.FUNCT_SRA:
        {
          name = "SRA";
          break;
        }

      case InstructionConstants_1.default.FUNCT_OR:
        {
          name = "OR";
          break;
        }

      case InstructionConstants_1.default.FUNCT_AND:
        {
          name = "";
          break;
        }
    }

    return name + " x" + InstructionHelper_1.default.getRd(instr) + ", x" + InstructionHelper_1.default.getRs1(instr) + ", x" + InstructionHelper_1.default.getRs2(instr);
  };

  InstructionDecoder.decodeALUI = function (instr) {
    var func7 = instr.asBinaryString().substr(0, 7);
    var func3 = instr.asBinaryString().substr(17, 3);
    var name = "-";

    switch (func3) {
      case InstructionConstants_1.default.FUNCT_ADDI:
        {
          name = "ADDI";
          break;
        }

      case InstructionConstants_1.default.FUNCT_SLTI:
        {
          name = "SLTI";
          break;
        }

      case InstructionConstants_1.default.FUNCT_SLTIU:
        {
          name = "SLTIU";
          break;
        }

      case InstructionConstants_1.default.FUNCT_XORI:
        {
          name = "XORI";
          break;
        }

      case InstructionConstants_1.default.FUNCT_ORI:
        {
          name = "ORI";
          break;
        }

      case InstructionConstants_1.default.FUNCT_ANDI:
        {
          name = "ANDI";
          break;
        }
    }

    switch (func7 + func3) {
      case InstructionConstants_1.default.FUNCT_SLLI:
        {
          name = "SSLI";
          break;
        }

      case InstructionConstants_1.default.FUNCT_SRLI:
        {
          name = "SRLI";
          break;
        }

      case InstructionConstants_1.default.FUNCT_SRAI:
        {
          name = "SRAI";
          break;
        }
    }

    var imm = InstructionHelper_1.default.getImmIType(instr);

    if (imm >= 1 << 11) {
      imm -= 1 << 12;
    }

    return name + " x" + InstructionHelper_1.default.getRd(instr) + ", x" + InstructionHelper_1.default.getRs1(instr) + ", " + imm.toString(10);
  };

  InstructionDecoder.decodeLW = function (instr) {
    var func = instr.asBinaryString().substr(17, 3);
    var name = "-";

    switch (func) {
      case InstructionConstants_1.default.FUNCT_LB:
        {
          name = "LB";
          break;
        }

      case InstructionConstants_1.default.FUNCT_LH:
        {
          name = "LH";
          break;
        }

      case InstructionConstants_1.default.FUNCT_LW:
        {
          name = "LW";
          break;
        }

      case InstructionConstants_1.default.FUNCT_LBU:
        {
          name = "LBU";
          break;
        }

      case InstructionConstants_1.default.FUNCT_LHU:
        {
          name = "LHU";
          break;
        }
    }

    return name + " x" + InstructionHelper_1.default.getRd(instr) + ", 0x" + InstructionHelper_1.default.getImmIType(instr).toString(16).toUpperCase() + "(x" + InstructionHelper_1.default.getRs1(instr) + ")";
  };

  InstructionDecoder.decodeSW = function (instr) {
    var func = instr.asBinaryString().substr(17, 3);
    var name = "-";

    switch (func) {
      case InstructionConstants_1.default.FUNCT_SB:
        {
          name = "SB";
          break;
        }

      case InstructionConstants_1.default.FUNCT_SH:
        {
          name = "SH";
          break;
        }

      case InstructionConstants_1.default.FUNCT_SW:
        {
          name = "SW";
          break;
        }
    }

    return name + " x" + InstructionHelper_1.default.getRs1(instr) + ", 0x" + InstructionHelper_1.default.getImmSType(instr).toString(16).toUpperCase() + "(x" + InstructionHelper_1.default.getRs2(instr) + ")";
  };

  InstructionDecoder.decodeBRANCH = function (instr) {
    var func = instr.asBinaryString().substr(17, 3);
    var name = "-";

    switch (func) {
      case InstructionConstants_1.default.FUNCT_BEQ:
        {
          name = "BEQ";
          break;
        }

      case InstructionConstants_1.default.FUNCT_BNE:
        {
          name = "BNE";
          break;
        }

      case InstructionConstants_1.default.FUNCT_BLT:
        {
          name = "BLT";
          break;
        }

      case InstructionConstants_1.default.FUNCT_BGE:
        {
          name = "BGE";
          break;
        }

      case InstructionConstants_1.default.FUNCT_BLTU:
        {
          name = "BLTU";
          break;
        }

      case InstructionConstants_1.default.FUNCT_BGEU:
        {
          name = "BGEU";
          break;
        }
    }

    var imm = InstructionHelper_1.default.getImmBType(instr);

    if (imm >= 1 << 12) {
      imm -= 1 << 13;
    }

    return name + " x" + InstructionHelper_1.default.getRs1(instr) + ", x" + InstructionHelper_1.default.getRs2(instr) + ", " + imm.toString(10);
  };

  InstructionDecoder.decodeJAL = function (instr) {
    return "JAL instruction";
  };

  InstructionDecoder.decodeJALR = function (instr) {
    return "JALR instruction";
  };

  return InstructionDecoder;
}();

exports.InstructionDecoder = InstructionDecoder;
},{"./InstructionConstants":"instructions/InstructionConstants.ts","./InstructionHelper":"instructions/InstructionHelper.ts"}],"instructions/InstructionFactory.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Value_1 = __importDefault(require("../util/Value"));

var InstructionConstants_1 = __importDefault(require("./InstructionConstants"));

var InstructionHelper_1 = __importDefault(require("./InstructionHelper"));

var InstructionFactory =
/** @class */
function () {
  function InstructionFactory() {}

  InstructionFactory.createRType = function (opCode, funct, rd, rs1, rs2) {
    var funct7 = funct.substr(0, 7);
    var funct3 = funct.substr(7, 3);
    var instr = funct7 + InstructionHelper_1.default.convertAndPad(rs2, 5) + InstructionHelper_1.default.convertAndPad(rs1, 5) + funct3 + InstructionHelper_1.default.convertAndPad(rd, 5) + opCode;
    return new Value_1.default(instr, 32);
  };

  InstructionFactory.createIType = function (opCode, funct, rd, rs1, imm) {
    var instr = InstructionHelper_1.default.convertAndPad(imm, 12) + InstructionHelper_1.default.convertAndPad(rs1, 5) + funct + InstructionHelper_1.default.convertAndPad(rd, 5) + opCode;
    return new Value_1.default(instr, 32);
  };

  InstructionFactory.createITypeShift = function (opCode, funct, rd, rs1, shamt) {
    var funct7 = funct.substr(0, 7);
    var funct3 = funct.substr(7, 3);
    var instr = funct7 + InstructionHelper_1.default.convertAndPad(shamt, 5) + InstructionHelper_1.default.convertAndPad(rs1, 5) + funct3 + InstructionHelper_1.default.convertAndPad(rd, 5) + opCode;
    return new Value_1.default(instr, 32);
  };

  InstructionFactory.createSType = function (opCode, funct, rs1, rs2, imm) {
    var immStr = InstructionHelper_1.default.convertAndPad(imm, 12);
    var imm11 = immStr.substr(0, 7);
    var imm4 = immStr.substr(7, 5);
    var instr = imm11 + InstructionHelper_1.default.convertAndPad(rs2, 5) + InstructionHelper_1.default.convertAndPad(rs1, 5) + funct + imm4 + opCode;
    return new Value_1.default(instr, 32);
  };

  InstructionFactory.createBType = function (opCode, funct, rs1, rs2, imm) {
    if (imm % 4 != 0) {
      console.error("Imm should be divisible by 4!");
      imm -= imm / 4;
    }

    imm /= 2;
    var immStr = InstructionHelper_1.default.convertAndPad(imm, 12);
    var imm12 = immStr.substr(0, 1);
    var imm10 = immStr.substr(2, 6);
    var imm4 = immStr.substr(8, 4);
    var imm11 = immStr.substr(1, 1);
    var instr = imm12 + imm10 + InstructionHelper_1.default.convertAndPad(rs2, 5) + InstructionHelper_1.default.convertAndPad(rs1, 5) + funct + imm4 + imm11 + opCode;
    return new Value_1.default(instr, 32);
  };

  InstructionFactory.compare = function (v, s) {
    console.log(v.asBinaryString());
    console.log(s.replace(/ /g, ""));
  };

  InstructionFactory.main = function (args) {
    if (args === void 0) {
      args = [];
    }

    this.compare(this.createRType(InstructionConstants_1.default.OP_CODE_ALU, InstructionConstants_1.default.FUNCT_ADD, 2, 1, 1), "0000000 00001 00001 000 00010 0110011");
  };

  return InstructionFactory;
}();

exports.default = InstructionFactory;
},{"../util/Value":"util/Value.ts","./InstructionConstants":"instructions/InstructionConstants.ts","./InstructionHelper":"instructions/InstructionHelper.ts"}],"components/InstructionMemory.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Component_1 = __importDefault(require("./Component"));

var Config_1 = __importDefault(require("../util/Config"));

var InstructionConstants_1 = __importDefault(require("../instructions/InstructionConstants"));

var InstructionDecoder_1 = require("../instructions/InstructionDecoder");

var InstructionFactory_1 = __importDefault(require("../instructions/InstructionFactory"));

var InstructionMemory =
/** @class */
function (_super) {
  __extends(InstructionMemory, _super);

  function InstructionMemory(x, y, values) {
    var _this = _super.call(this, x, y) || this;

    _this.values = [];
    _this._decoded = true;
    _this.values = values;
    _this.values[0] = InstructionFactory_1.default.createIType(InstructionConstants_1.default.OP_CODE_LW, InstructionConstants_1.default.FUNCT_LW, 1, 0, 124);
    _this.values[1] = InstructionFactory_1.default.createIType(InstructionConstants_1.default.OP_CODE_ALUI, InstructionConstants_1.default.FUNCT_ADDI, 2, 0, 0);
    _this.values[2] = InstructionFactory_1.default.createIType(InstructionConstants_1.default.OP_CODE_ALUI, InstructionConstants_1.default.FUNCT_ADDI, 3, 0, 0);
    _this.values[3] = InstructionFactory_1.default.createBType(InstructionConstants_1.default.OP_CODE_BRANCH, InstructionConstants_1.default.FUNCT_BGE, 2, 1, 112);
    _this.values[4] = InstructionFactory_1.default.createIType(InstructionConstants_1.default.OP_CODE_ALUI, InstructionConstants_1.default.FUNCT_ADDI, 4, 0, 0);
    _this.values[5] = InstructionFactory_1.default.createSType(InstructionConstants_1.default.OP_CODE_SW, InstructionConstants_1.default.FUNCT_SW, 3, 4, 0);
    _this.values[6] = InstructionFactory_1.default.createIType(InstructionConstants_1.default.OP_CODE_ALUI, InstructionConstants_1.default.FUNCT_ADDI, 2, 2, 1);
    _this.values[7] = InstructionFactory_1.default.createIType(InstructionConstants_1.default.OP_CODE_ALUI, InstructionConstants_1.default.FUNCT_ADDI, 3, 3, 4);
    _this.values[8] = InstructionFactory_1.default.createBType(InstructionConstants_1.default.OP_CODE_BRANCH, InstructionConstants_1.default.FUNCT_BGE, 2, 1, 92);
    _this.values[9] = InstructionFactory_1.default.createIType(InstructionConstants_1.default.OP_CODE_ALUI, InstructionConstants_1.default.FUNCT_ADDI, 5, 0, 1);
    _this.values[10] = InstructionFactory_1.default.createSType(InstructionConstants_1.default.OP_CODE_SW, InstructionConstants_1.default.FUNCT_SW, 3, 5, 0);
    _this.values[11] = InstructionFactory_1.default.createIType(InstructionConstants_1.default.OP_CODE_ALUI, InstructionConstants_1.default.FUNCT_ADDI, 2, 2, 1);
    _this.values[12] = InstructionFactory_1.default.createIType(InstructionConstants_1.default.OP_CODE_ALUI, InstructionConstants_1.default.FUNCT_ADDI, 3, 3, 4);
    _this.values[13] = InstructionFactory_1.default.createBType(InstructionConstants_1.default.OP_CODE_BRANCH, InstructionConstants_1.default.FUNCT_BGE, 2, 1, 72);
    _this.values[14] = InstructionFactory_1.default.createRType(InstructionConstants_1.default.OP_CODE_ALU, InstructionConstants_1.default.FUNCT_ADD, 6, 5, 0);
    _this.values[15] = InstructionFactory_1.default.createRType(InstructionConstants_1.default.OP_CODE_ALU, InstructionConstants_1.default.FUNCT_ADD, 5, 5, 4);
    _this.values[16] = InstructionFactory_1.default.createRType(InstructionConstants_1.default.OP_CODE_ALU, InstructionConstants_1.default.FUNCT_ADD, 4, 6, 0);
    _this.values[17] = InstructionFactory_1.default.createSType(InstructionConstants_1.default.OP_CODE_SW, InstructionConstants_1.default.FUNCT_SW, 3, 5, 0);
    _this.values[18] = InstructionFactory_1.default.createIType(InstructionConstants_1.default.OP_CODE_ALUI, InstructionConstants_1.default.FUNCT_ADDI, 2, 2, 1);
    _this.values[19] = InstructionFactory_1.default.createIType(InstructionConstants_1.default.OP_CODE_ALUI, InstructionConstants_1.default.FUNCT_ADDI, 3, 3, 4);
    _this.values[20] = InstructionFactory_1.default.createBType(InstructionConstants_1.default.OP_CODE_BRANCH, InstructionConstants_1.default.FUNCT_BGE, 0, 0, -28);
    _this.values[31] = InstructionFactory_1.default.createBType(InstructionConstants_1.default.OP_CODE_BRANCH, InstructionConstants_1.default.FUNCT_BGE, 0, 0, 0);
    return _this;
  }

  InstructionMemory.prototype.refresh = function () {
    this.selectedInstr = undefined;
  };

  InstructionMemory.prototype.draw = function (g) {
    g.fillRect(this.x, this.y, 230, InstructionMemory.SIZE * 20 + 30, Config_1.default.elementFillColor, Config_1.default.elementStrokeColor);

    for (var i = 0; i < InstructionMemory.SIZE; i++) {
      g.fillRect(this.x + 15, this.y + 15 + i * 20, 200, 20, Config_1.default.memoryFillColor, Config_1.default.memoryStrokeColor, 1);
      var text = this._decoded ? InstructionDecoder_1.InstructionDecoder.decode(this.values[i]) : this.values[i].asHexString();
      var color = this.selectedInstr == i ? Config_1.default.readFontColor : Config_1.default.fontColor;
      g.drawText(this.x + 15 + 10, this.y + 15 + 17 + i * 20, text, color, 18);
    }

    if (this.selectedInstr != undefined) {
      var instrY = this.y + 15 + this.selectedInstr * 20 + 11;
      g.drawPath([[this.x + 215, instrY], [this.x + 222.5, instrY], [this.x + 222.5, this._outputDataNode.y], [this._outputDataNode.x, this._outputDataNode.y]], Config_1.default.signalColor);
    }
  };

  InstructionMemory.prototype.forwardSignal = function (signaler, value) {
    this.selectedInstr = value.asUnsignedInt() / 4;

    this._outputDataNode.forwardSignal(this, this.values[this.selectedInstr]);
  };

  InstructionMemory.prototype.mark = function (caller) {
    this._addressNode.mark(this);
  };

  Object.defineProperty(InstructionMemory.prototype, "addressNode", {
    set: function set(node) {
      this._addressNode = node;
      node.addNeighbour(this);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(InstructionMemory.prototype, "outputDataNode", {
    set: function set(node) {
      this._outputDataNode = node;
    },
    enumerable: true,
    configurable: true
  });
  InstructionMemory.SIZE = 32;
  return InstructionMemory;
}(Component_1.default);

exports.default = InstructionMemory;
},{"./Component":"components/Component.ts","../util/Config":"util/Config.ts","../instructions/InstructionConstants":"instructions/InstructionConstants.ts","../instructions/InstructionDecoder":"instructions/InstructionDecoder.ts","../instructions/InstructionFactory":"instructions/InstructionFactory.ts"}],"components/Multiplexer.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Component_1 = __importDefault(require("./Component"));

var Graphics_1 = __importDefault(require("../util/Graphics"));

var Config_1 = __importDefault(require("../util/Config"));

var MultiplexerOrientation;

(function (MultiplexerOrientation) {
  MultiplexerOrientation[MultiplexerOrientation["LEFT"] = 0] = "LEFT";
  MultiplexerOrientation[MultiplexerOrientation["RIGHT"] = 1] = "RIGHT";
})(MultiplexerOrientation = exports.MultiplexerOrientation || (exports.MultiplexerOrientation = {}));

var Multiplexer =
/** @class */
function (_super) {
  __extends(Multiplexer, _super);

  function Multiplexer(x, y, ninputs, orientation, inputDistance) {
    if (orientation === void 0) {
      orientation = MultiplexerOrientation.RIGHT;
    }

    if (inputDistance === void 0) {
      inputDistance = 15;
    }

    var _this = _super.call(this, x, y) || this;

    _this.selValue = undefined;
    _this.inputValues = [];
    _this.marked = false;
    _this.ninputs = ninputs;
    _this.orientation = orientation;
    _this.inputDistance = inputDistance;
    _this._inputNodes = [];
    return _this;
  }

  Multiplexer.prototype.draw = function (g) {
    var height = 50 + (this.ninputs - 1) * this.inputDistance;

    if (this.orientation == MultiplexerOrientation.RIGHT) {
      g.fillPolygon(Graphics_1.default.addOffset([[0, 0], [25, 15], [25, height - 15], [0, height]], this.x, this.y), Config_1.default.elementFillColor, Config_1.default.elementStrokeColor);
    } else {
      g.fillPolygon(Graphics_1.default.addOffset([[0, 15], [25, 0], [25, height], [0, height - 15]], this.x, this.y), Config_1.default.elementFillColor, Config_1.default.elementStrokeColor);
    }

    if (this.marked) {
      var y = this._inputNodes[this.selValue].y;
      var xCenter = this.x + 12.5;
      var yCenter = this.y + height / 2;

      if (this.orientation == MultiplexerOrientation.RIGHT) {
        g.drawPath([[this.x, y], [xCenter, y], [xCenter, yCenter], [this.x + 25, yCenter]], Config_1.default.signalColor);
      } else {
        g.drawPath([[this.x + 25, y], [xCenter, y], [xCenter, yCenter], [this.x, yCenter]], Config_1.default.signalColor);
      }
    } // if (this.orientation == MultiplexerOrientation.RIGHT) {
    //     for (let i = 0; i < this.ninputs; i++) {
    //         g.fillCircle(this.x, this.y + 25 + i * this.inputDistance, 2, "red");
    //     }
    //     g.fillCircle(this.x + 25, this.y + height / 2, 2, "red");
    // } else {
    //     for (let i = 0; i < this.ninputs; i++) {
    //         g.fillCircle(this.x + 25, this.y + 25 + i * this.inputDistance, 2, "red");
    //     }
    //     g.fillCircle(this.x, this.y + height / 2, 2, "red");
    // }

  };

  Multiplexer.prototype.forwardSignal = function (signaler, value) {
    if (signaler == this._selInputNode) {
      this.selValue = value.asUnsignedInt();
    } else {
      for (var i in this._inputNodes) {
        if (signaler == this._inputNodes[i]) {
          this.inputValues[i] = value;
          break;
        }
      }
    }

    if (this.selValue != undefined && this.inputValues[this.selValue]) {
      this._outNode.forwardSignal(this, this.inputValues[this.selValue]);
    }
  };

  Multiplexer.prototype.refresh = function () {
    this.selValue = undefined;
    this.inputValues = [];
    this.marked = false;
  };

  Multiplexer.prototype.mark = function (caller) {
    this.marked = true;

    this._selInputNode.mark(this);

    if (this._inputNodes[this.selValue]) {
      this._inputNodes[this.selValue].mark(this);
    } else {
      console.log("Error");
    }
  };

  Multiplexer.prototype.setInputNode = function (idx, node) {
    this._inputNodes[idx] = node;
    node.addNeighbour(this);
  };

  Object.defineProperty(Multiplexer.prototype, "selInputNode", {
    set: function set(node) {
      this._selInputNode = node;
      node.addNeighbour(this);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Multiplexer.prototype, "outNode", {
    set: function set(node) {
      this._outNode = node;
    },
    enumerable: true,
    configurable: true
  });
  return Multiplexer;
}(Component_1.default);

exports.default = Multiplexer;
},{"./Component":"components/Component.ts","../util/Graphics":"util/Graphics.ts","../util/Config":"util/Config.ts"}],"components/ALUControl.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Component_1 = __importDefault(require("./Component"));

var Config_1 = __importDefault(require("../util/Config"));

var Value_1 = __importDefault(require("../util/Value"));

var ArithmeticLogicUnit_1 = __importDefault(require("./ArithmeticLogicUnit"));

var InstructionConstants_1 = __importDefault(require("../instructions/InstructionConstants"));

var ALUControl =
/** @class */
function (_super) {
  __extends(ALUControl, _super);

  function ALUControl(x, y) {
    var _this = _super.call(this, x, y) || this;

    _this.refresh();

    return _this;
  }

  ALUControl.prototype.draw = function (g) {
    g.fillRect(this.x, this.y, 100, 50, Config_1.default.elementFillColor, Config_1.default.elementStrokeColor);
    g.drawText(this.x + 30, this.y + 23, "ALU", Config_1.default.fontColor, Config_1.default.fontSize);
    g.drawText(this.x + 10, this.y + 43, "Control", Config_1.default.fontColor, Config_1.default.fontSize);
  };

  ALUControl.prototype.refresh = function () {
    this.instrValue = undefined;
    this.ctrlValue = undefined;
  };

  ALUControl.prototype.forwardSignal = function (signaler, value) {
    switch (signaler) {
      case this._instrNode:
        {
          this.instrValue = value;
          break;
        }

      case this._controlNode:
        {
          this.ctrlValue = value;
          break;
        }

      default:
        {
          console.log("Error");
        }
    }

    if (this.instrValue == undefined || this.ctrlValue == undefined) {
      return;
    }

    var result;

    switch (this.ctrlValue) {
      case ALUControl.FUNC:
        {
          result = this.handleFunc();
          break;
        }

      case ALUControl.OP:
        {
          result = this.handleOp();
          break;
        }

      case ALUControl.ADD:
        {
          result = ArithmeticLogicUnit_1.default.ADD;
          break;
        }

      default:
        {
          console.log("Unsupported control signal");
        }
    }

    if (result == undefined) {
      console.log("Unsupported operation");
    } else {
      this._outNode.forwardSignal(this, result);
    }
  };

  ALUControl.prototype.handleFunc = function () {
    var func7 = this.instrValue.asBinaryString().substr(0, 7);
    var func3 = this.instrValue.asBinaryString().substr(17, 3);
    var func = func7 + func3;

    switch (func) {
      case InstructionConstants_1.default.FUNCT_ADD:
        return ArithmeticLogicUnit_1.default.ADD;

      case InstructionConstants_1.default.FUNCT_SUB:
        return ArithmeticLogicUnit_1.default.SUB;

      case InstructionConstants_1.default.FUNCT_SLL:
        return ArithmeticLogicUnit_1.default.SLL;

      case InstructionConstants_1.default.FUNCT_SLT:
        return ArithmeticLogicUnit_1.default.SLT;

      case InstructionConstants_1.default.FUNCT_SLTU:
        return ArithmeticLogicUnit_1.default.SLTU;

      case InstructionConstants_1.default.FUNCT_XOR:
        return ArithmeticLogicUnit_1.default.XOR;

      case InstructionConstants_1.default.FUNCT_SRL:
        return ArithmeticLogicUnit_1.default.XOR;

      case InstructionConstants_1.default.FUNCT_SRA:
        return ArithmeticLogicUnit_1.default.SRA;

      case InstructionConstants_1.default.FUNCT_OR:
        return ArithmeticLogicUnit_1.default.OR;

      case InstructionConstants_1.default.FUNCT_AND:
        return ArithmeticLogicUnit_1.default.AND;

      default:
        return null;
    }
  };

  ALUControl.prototype.handleOp = function () {
    var func7 = this.instrValue.asBinaryString().substr(0, 7);
    var func3 = this.instrValue.asBinaryString().substr(17, 3);

    switch (func3) {
      case InstructionConstants_1.default.FUNCT_ADDI:
        return ArithmeticLogicUnit_1.default.ADD;

      case InstructionConstants_1.default.FUNCT_SLTI:
        return ArithmeticLogicUnit_1.default.SLT;

      case InstructionConstants_1.default.FUNCT_SLTIU:
        return ArithmeticLogicUnit_1.default.SLTU;

      case InstructionConstants_1.default.FUNCT_XORI:
        return ArithmeticLogicUnit_1.default.XOR;

      case InstructionConstants_1.default.FUNCT_ORI:
        return ArithmeticLogicUnit_1.default.OR;

      case InstructionConstants_1.default.FUNCT_ANDI:
        return ArithmeticLogicUnit_1.default.AND;
    }

    switch (func7 + func3) {
      case InstructionConstants_1.default.FUNCT_SLLI:
        return ArithmeticLogicUnit_1.default.SLL;

      case InstructionConstants_1.default.FUNCT_SRLI:
        return ArithmeticLogicUnit_1.default.SRL;

      case InstructionConstants_1.default.FUNCT_SRAI:
        return ArithmeticLogicUnit_1.default.SRA;

      default:
        return undefined;
    }
  };

  ALUControl.prototype.mark = function (caller) {
    this._instrNode.mark(this);

    this._controlNode.mark(this);
  };

  Object.defineProperty(ALUControl.prototype, "instrNode", {
    set: function set(node) {
      this._instrNode = node;
      node.addNeighbour(this);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ALUControl.prototype, "controlNode", {
    set: function set(node) {
      this._controlNode = node;
      node.addNeighbour(this);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ALUControl.prototype, "outNode", {
    set: function set(node) {
      this._outNode = node;
    },
    enumerable: true,
    configurable: true
  });
  ALUControl.FUNC = Value_1.default.fromUnsignedInt(0, 2);
  ALUControl.OP = Value_1.default.fromUnsignedInt(1, 2);
  ALUControl.ADD = Value_1.default.fromUnsignedInt(2, 2);
  return ALUControl;
}(Component_1.default);

exports.default = ALUControl;
},{"./Component":"components/Component.ts","../util/Config":"util/Config.ts","../util/Value":"util/Value.ts","./ArithmeticLogicUnit":"components/ArithmeticLogicUnit.ts","../instructions/InstructionConstants":"instructions/InstructionConstants.ts"}],"components/DataMemory.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) {
    if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  }
  result["default"] = mod;
  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Config_1 = __importDefault(require("../util/Config"));

var Component_1 = __importDefault(require("./Component"));

var Value_1 = __importStar(require("../util/Value"));

var InstructionHelper_1 = __importDefault(require("../instructions/InstructionHelper"));

var InstructionConstants_1 = __importDefault(require("../instructions/InstructionConstants"));

var DataMemory =
/** @class */
function (_super) {
  __extends(DataMemory, _super);

  function DataMemory(x, y) {
    var _this = _super.call(this, x, y) || this;

    _this.size = 32;
    _this.values = [];
    _this.nextValue = [];

    for (var i = 0; i < _this.size + 1; i++) {
      // this.values.push(VAL_ZERO_32b);
      _this.values.push(Value_1.VAL_MAX_32b);
    }

    _this.values[31] = Value_1.default.fromUnsignedInt(25, 32);
    return _this;
  }

  DataMemory.prototype.draw = function (g) {
    g.fillRect(this.x, this.y, 100, this.size * 15 + 20, Config_1.default.elementFillColor, Config_1.default.elementStrokeColor);

    for (var i = 0; i < this.size; i++) {
      g.fillRect(this.x + 10, this.y + 10 + i * 15, 80, 15, Config_1.default.memoryFillColor, Config_1.default.memoryStrokeColor, 1);
      g.drawText(this.x + 10 + 5, this.y + 10 + 12 + i * 15, this.values[i].asHexString(), Config_1.default.fontColor, 12);
    }
  };

  DataMemory.prototype.refresh = function () {
    this.instrValue = undefined;
    this.writeEnValue = undefined;
    this.addressValue = undefined;

    for (var i in this.nextValue) {
      this.values[i] = this.nextValue[i];
    }

    this.nextValue = [];
  };

  DataMemory.prototype.forwardSignal = function (signaler, value) {
    switch (signaler) {
      case this._instrNode:
        {
          this.instrValue = value;
          break;
        }

      case this._writeEnNode:
        {
          this.writeEnValue = value;
          break;
        }

      case this._addressNode:
        {
          this.addressValue = value;
          break;
        }

      default:
        {
          console.log("Error");
        }
    }

    if (this.instrValue == undefined || this.writeEnValue == undefined || this.addressValue == undefined) {
      return;
    }

    if (InstructionHelper_1.default.getOpCodeStr(this.instrValue) != InstructionConstants_1.default.OP_CODE_LW) {
      return;
    }

    var funct = InstructionHelper_1.default.getFuncLType(this.instrValue);
    var nbytes;

    switch (funct) {
      case InstructionConstants_1.default.FUNCT_LB:
      case InstructionConstants_1.default.FUNCT_LBU:
        {
          nbytes = 1;
          break;
        }

      case InstructionConstants_1.default.FUNCT_LH:
      case InstructionConstants_1.default.FUNCT_LHU:
        {
          nbytes = 2;
          break;
        }

      case InstructionConstants_1.default.FUNCT_LW:
        {
          nbytes = 4;
          break;
        }

      default:
        {
          console.log("Error");
        }
    }

    var address = this.addressValue.asUnsignedInt();
    var wordIdx = Math.floor(address / 4);
    var byteIdx = address % 4;
    var result = "";

    for (var i = 0; i < nbytes; i++) {
      result = this.values[wordIdx].getByteBinary(byteIdx) + result;

      if (++byteIdx == 4) {
        byteIdx = 0;
        wordIdx++;
      }
    }
    /* Sign extend */


    if (funct == InstructionConstants_1.default.FUNCT_LBU || funct == InstructionConstants_1.default.FUNCT_LHU || true) {
      var signBit = result[0];

      while (result.length < 32) {
        result = signBit + result;
      }
    }

    this._outputDataNode.forwardSignal(this, new Value_1.default(result, 32));
  };

  DataMemory.prototype.mark = function (caller) {
    this._instrNode.mark(this);

    this._writeEnNode.mark(this);

    this._addressNode.mark(this);
  };

  DataMemory.prototype.onRisingEdge = function () {
    if (this._writeEnNode.value == DataMemory.WRITE_YES) {
      if (this._addressNode.value == null || this._inputDataNode.value == null) {
        console.log("Error");
      }

      var funct = InstructionHelper_1.default.getFuncSType(this.instrValue);
      var nbytes = void 0;

      switch (funct) {
        case InstructionConstants_1.default.FUNCT_SB:
          {
            nbytes = 1;
            break;
          }

        case InstructionConstants_1.default.FUNCT_SH:
          {
            nbytes = 2;
            break;
          }

        case InstructionConstants_1.default.FUNCT_SW:
          {
            nbytes = 4;
            break;
          }

        default:
          {
            console.log("Error");
          }
      }

      var address = this._addressNode.value.asUnsignedInt();

      var wordIdx = Math.floor(address / 4);
      var byteIdx = address % 4;
      var writeValue = this._inputDataNode.value;
      this.nextValue[wordIdx] = this.values[wordIdx];
      this.nextValue[wordIdx + 1] = this.values[wordIdx + 1];

      for (var i = 0; i < nbytes; i++) {
        this.nextValue[wordIdx] = this.nextValue[wordIdx].writeByte(byteIdx, writeValue.getByteBinary(i));

        if (++byteIdx == 4) {
          byteIdx = 0;
          wordIdx++;
        }
      }

      this._writeEnNode.mark(this);

      this._addressNode.mark(this);

      this._inputDataNode.mark(this);
    }
  };

  Object.defineProperty(DataMemory.prototype, "instrNode", {
    set: function set(node) {
      this._instrNode = node;
      node.addNeighbour(this);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DataMemory.prototype, "writeEnNode", {
    set: function set(node) {
      this._writeEnNode = node;
      node.addNeighbour(this);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DataMemory.prototype, "addressNode", {
    set: function set(node) {
      this._addressNode = node;
      node.addNeighbour(this);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DataMemory.prototype, "inputDataNode", {
    set: function set(node) {
      this._inputDataNode = node;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DataMemory.prototype, "outputDataNode", {
    set: function set(node) {
      this._outputDataNode = node;
    },
    enumerable: true,
    configurable: true
  });
  DataMemory.WRITE_NO = Value_1.default.fromUnsignedInt(0, 1);
  DataMemory.WRITE_YES = Value_1.default.fromUnsignedInt(1, 1);
  return DataMemory;
}(Component_1.default);

exports.default = DataMemory;
},{"../util/Config":"util/Config.ts","./Component":"components/Component.ts","../util/Value":"util/Value.ts","../instructions/InstructionHelper":"instructions/InstructionHelper.ts","../instructions/InstructionConstants":"instructions/InstructionConstants.ts"}],"components/RegisterFile.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) {
    if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  }
  result["default"] = mod;
  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Component_1 = __importDefault(require("./Component"));

var Config_1 = __importDefault(require("../util/Config"));

var Value_1 = __importStar(require("../util/Value"));

var InstructionHelper_1 = __importDefault(require("../instructions/InstructionHelper"));

var RegisterFile =
/** @class */
function (_super) {
  __extends(RegisterFile, _super);

  function RegisterFile(x, y) {
    var _this = _super.call(this, x, y) || this;

    _this.maxSize = 32;
    _this.size = 16;
    _this.values = [];

    for (var i = 0; i < _this.maxSize; i++) {
      _this.values.push(Value_1.VAL_ZERO_32b);
    }

    _this.nextValue = undefined;
    _this.nextSel = undefined;
    return _this;
  }

  RegisterFile.prototype.refresh = function () {
    if (this.nextSel && this.nextValue) {
      this.values[this.nextSel] = this.nextValue;
    }

    this.nextValue = undefined;
    this.nextSel = undefined;
    this.selectedReadReg1 = undefined;
    this.readReg1Marked = false;
    this.selectedReadReg2 = undefined;
    this.readReg2Marked = false;
    this.selectedWriteReg = undefined;
  };

  RegisterFile.prototype.draw = function (g) {
    g.fillRect(this.x, this.y, 150, this.size * 20 + 30, Config_1.default.elementFillColor, Config_1.default.elementStrokeColor);

    for (var i = 0; i < this.size; i++) {
      g.fillRect(this.x + 15, this.y + 15 + i * 20, 120, 20, Config_1.default.memoryFillColor, Config_1.default.memoryStrokeColor, 1);
      g.drawText(this.x + 15 + 5, this.y + 15 + 17 + i * 20, this.values[i].asHexString(), Config_1.default.fontColor, 18);
    }

    if (this.selectedWriteReg != undefined) {
      var regY = this.y + 15 + this.selectedWriteReg * 20 + 10;
      g.drawPath([[this.x, this._inputWriteDataNode.y], [this.x + 7.5, this._inputWriteDataNode.y], [this.x + 7.5, regY], [this.x + 15, regY]], Config_1.default.signalColor);
    }

    if (this.selectedReadReg1 != undefined && this.readReg1Marked) {
      var regY = this.y + 15 + this.selectedReadReg1 * 20 + 10;
      g.drawPath([[this.x + 135, regY], [this.x + 140, regY], [this.x + 140, this._readSel1Node.y], [this.x + 150, this._readSel1Node.y]], Config_1.default.signalColor);
    }

    if (this.selectedReadReg2 != undefined && this.readReg2Marked) {
      var regY = this.y + 15 + this.selectedReadReg2 * 20 + 10;
      g.drawPath([[this.x + 135, regY], [this.x + 145, regY], [this.x + 145, this._readSel2Node.y], [this.x + 150, this._readSel2Node.y]], Config_1.default.signalColor);
    }
  };

  RegisterFile.prototype.forwardSignal = function (signaler, value) {
    if (signaler == this._readSel1Node) {
      this.selectedReadReg1 = InstructionHelper_1.default.getRs1(value);

      this._readData1Node.forwardSignal(this, this.values[this.selectedReadReg1]);
    } else if (signaler == this._readSel2Node) {
      this.selectedReadReg2 = InstructionHelper_1.default.getRs2(value);

      this._readData2Node.forwardSignal(this, this.values[this.selectedReadReg2]);
    } else {
      console.error("Error");
    }
  };

  RegisterFile.prototype.onRisingEdge = function () {
    if (this._inputWriteEnNode.value == RegisterFile.WRITE_YES) {
      this.nextSel = InstructionHelper_1.default.getRd(this._inputWriteSelNode.value);
      this.selectedWriteReg = this.nextSel;

      if (this._inputWriteDataNode.value == null) {
        console.log("Error");
        return;
      }

      this.nextValue = this._inputWriteDataNode.value;

      this._inputWriteEnNode.mark(this);

      this._inputWriteSelNode.mark(this);

      this._inputWriteDataNode.mark(this);
    }
  };

  RegisterFile.prototype.mark = function (caller) {
    switch (caller) {
      case this._readData1Node:
        {
          this.readReg1Marked = true;

          this._readSel1Node.mark(this);

          break;
        }

      case this._readData2Node:
        {
          this.readReg2Marked = true;

          this._readSel2Node.mark(this);

          break;
        }

      default:
        {
          console.error("Error");
        }
    }
  };

  Object.defineProperty(RegisterFile.prototype, "readSel1Node", {
    set: function set(node) {
      this._readSel1Node = node;
      node.addNeighbour(this);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(RegisterFile.prototype, "readSel2Node", {
    set: function set(node) {
      this._readSel2Node = node;
      node.addNeighbour(this);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(RegisterFile.prototype, "inputWriteSelNode", {
    set: function set(node) {
      this._inputWriteSelNode = node;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(RegisterFile.prototype, "inputWriteEnNode", {
    set: function set(node) {
      this._inputWriteEnNode = node;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(RegisterFile.prototype, "inputWriteDataNode", {
    set: function set(node) {
      this._inputWriteDataNode = node;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(RegisterFile.prototype, "readData1Node", {
    set: function set(node) {
      this._readData1Node = node;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(RegisterFile.prototype, "readData2Node", {
    set: function set(node) {
      this._readData2Node = node;
    },
    enumerable: true,
    configurable: true
  });
  RegisterFile.WRITE_NO = Value_1.default.fromUnsignedInt(0, 1);
  RegisterFile.WRITE_YES = Value_1.default.fromUnsignedInt(1, 1);
  return RegisterFile;
}(Component_1.default);

exports.default = RegisterFile;
},{"./Component":"components/Component.ts","../util/Config":"util/Config.ts","../util/Value":"util/Value.ts","../instructions/InstructionHelper":"instructions/InstructionHelper.ts"}],"components/ImmSelect.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Component_1 = __importDefault(require("./Component"));

var Config_1 = __importDefault(require("../util/Config"));

var Value_1 = __importDefault(require("../util/Value"));

var InstructionHelper_1 = __importDefault(require("../instructions/InstructionHelper"));

var ImmSelect =
/** @class */
function (_super) {
  __extends(ImmSelect, _super);

  function ImmSelect(x, y) {
    var _this = _super.call(this, x, y) || this;

    _this.refresh();

    return _this;
  }

  ImmSelect.prototype.draw = function (g) {
    g.fillRect(this.x, this.y, 100, 50, Config_1.default.elementFillColor, Config_1.default.elementStrokeColor);
    g.drawText(this.x + 30, this.y + 23, "Imm", Config_1.default.fontColor, Config_1.default.fontSize);
    g.drawText(this.x + 15, this.y + 43, "Select", Config_1.default.fontColor, Config_1.default.fontSize);
  };

  ImmSelect.prototype.refresh = function () {
    this.instrValue = undefined;
    this.ctrlValue = undefined;
  };

  ImmSelect.prototype.forwardSignal = function (signaler, value) {
    switch (signaler) {
      case this._instrNode:
        {
          this.instrValue = value;
          break;
        }

      case this._controlNode:
        {
          this.ctrlValue = value;
          break;
        }

      default:
        {
          console.log("Error");
        }
    }

    if (this.instrValue == undefined || this.ctrlValue == undefined) {
      return;
    }

    var result;

    switch (this.ctrlValue) {
      case ImmSelect.ITYPE:
        {
          result = Value_1.default.fromUnsignedInt(InstructionHelper_1.default.getImmIType(this.instrValue), 12);
          break;
        }

      case ImmSelect.BRTYPE:
        {
          result = Value_1.default.fromUnsignedInt(InstructionHelper_1.default.getImmBType(this.instrValue), 13);
          break;
        }

      case ImmSelect.BSTYPE:
        {
          result = Value_1.default.fromUnsignedInt(InstructionHelper_1.default.getImmSType(this.instrValue), 12);
          break;
        }

      default:
        {
          result = new Value_1.default("0", 12);
          console.log("Unsupported control signal");
        }
    }

    this._outNode.forwardSignal(this, result.signExtend(32));
  };

  ImmSelect.prototype.mark = function (caller) {
    this._instrNode.mark(this);

    this._controlNode.mark(this);
  };

  Object.defineProperty(ImmSelect.prototype, "instrNode", {
    set: function set(node) {
      this._instrNode = node;
      node.addNeighbour(this);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ImmSelect.prototype, "controlNode", {
    set: function set(node) {
      this._controlNode = node;
      node.addNeighbour(this);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ImmSelect.prototype, "outNode", {
    set: function set(node) {
      this._outNode = node;
    },
    enumerable: true,
    configurable: true
  });
  ImmSelect.ITYPE = Value_1.default.fromUnsignedInt(0, 2);
  ImmSelect.BRTYPE = Value_1.default.fromUnsignedInt(1, 2);
  ImmSelect.BSTYPE = Value_1.default.fromUnsignedInt(2, 2);
  return ImmSelect;
}(Component_1.default);

exports.default = ImmSelect;
},{"./Component":"components/Component.ts","../util/Config":"util/Config.ts","../util/Value":"util/Value.ts","../instructions/InstructionHelper":"instructions/InstructionHelper.ts"}],"components/BranchLogic.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Component_1 = __importDefault(require("./Component"));

var Config_1 = __importDefault(require("../util/Config"));

var Value_1 = __importDefault(require("../util/Value"));

var InstructionHelper_1 = __importDefault(require("../instructions/InstructionHelper"));

var InstructionConstants_1 = __importDefault(require("../instructions/InstructionConstants"));

var BranchLogic =
/** @class */
function (_super) {
  __extends(BranchLogic, _super);

  function BranchLogic(x, y) {
    return _super.call(this, x, y) || this;
  }

  BranchLogic.prototype.draw = function (g) {
    g.fillRect(this.x, this.y, 100, 50, Config_1.default.elementFillColor, Config_1.default.elementStrokeColor);
    g.drawTextCentered(this.x, this.y + 23, 100, "Branch", Config_1.default.fontColor, Config_1.default.fontSize);
    g.drawTextCentered(this.x, this.y + 43, 100, "Logic", Config_1.default.fontColor, Config_1.default.fontSize);
  };

  BranchLogic.prototype.forwardSignal = function (signaler, value) {
    switch (signaler) {
      case this._data1Node:
        this.data1Value = value;
        break;

      case this._data2Node:
        this.data2Value = value;
        break;

      case this._instrNode:
        this.instrValue = value;
        break;
    }

    if (this.data1Value == undefined || this.data2Value == undefined || this.instrValue == undefined) {
      return;
    }

    var func = InstructionHelper_1.default.getFuncBType(this.instrValue);
    var result;

    switch (func) {
      case InstructionConstants_1.default.FUNCT_BEQ:
        {
          result = Value_1.default.cmpEQ(this.data1Value, this.data2Value);
          break;
        }

      case InstructionConstants_1.default.FUNCT_BNE:
        {
          result = Value_1.default.cmpNE(this.data1Value, this.data2Value);
          break;
        }

      case InstructionConstants_1.default.FUNCT_BLT:
        {
          result = Value_1.default.cmpLT(this.data1Value, this.data2Value);
          break;
        }

      case InstructionConstants_1.default.FUNCT_BGE:
        {
          result = Value_1.default.cmpGE(this.data1Value, this.data2Value);
          break;
        }

      case InstructionConstants_1.default.FUNCT_BLTU:
        {
          result = Value_1.default.cmpLTU(this.data1Value, this.data2Value);
          break;
        }

      case InstructionConstants_1.default.FUNCT_BGEU:
        {
          result = Value_1.default.cmpGEU(this.data1Value, this.data2Value);
          break;
        }
    }

    this._outNode.forwardSignal(this, result ? BranchLogic.BRANCH_TRUE : BranchLogic.BRANCH_FALSE);
  };

  BranchLogic.prototype.mark = function (caller) {
    this._data1Node.mark(this);

    this._data2Node.mark(this);

    this._instrNode.mark(this);
  };

  Object.defineProperty(BranchLogic.prototype, "data1Node", {
    set: function set(node) {
      this._data1Node = node;
      node.addNeighbour(this);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(BranchLogic.prototype, "data2Node", {
    set: function set(node) {
      this._data2Node = node;
      node.addNeighbour(this);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(BranchLogic.prototype, "instrNode", {
    set: function set(node) {
      this._instrNode = node;
      node.addNeighbour(this);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(BranchLogic.prototype, "outNode", {
    set: function set(value) {
      this._outNode = value;
    },
    enumerable: true,
    configurable: true
  });
  BranchLogic.BRANCH_TRUE = new Value_1.default("0", 1);
  BranchLogic.BRANCH_FALSE = new Value_1.default("1", 1);
  return BranchLogic;
}(Component_1.default);

exports.default = BranchLogic;
},{"./Component":"components/Component.ts","../util/Config":"util/Config.ts","../util/Value":"util/Value.ts","../instructions/InstructionHelper":"instructions/InstructionHelper.ts","../instructions/InstructionConstants":"instructions/InstructionConstants.ts"}],"components/ControlUnit.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Component_1 = __importDefault(require("./Component"));

var Value_1 = require("../util/Value");

var ALUControl_1 = __importDefault(require("./ALUControl"));

var DataMemory_1 = __importDefault(require("./DataMemory"));

var RegisterFile_1 = __importDefault(require("./RegisterFile"));

var InstructionHelper_1 = __importDefault(require("../instructions/InstructionHelper"));

var ImmSelect_1 = __importDefault(require("./ImmSelect"));

var BranchLogic_1 = __importDefault(require("./BranchLogic"));

var InstructionConstants_1 = __importDefault(require("../instructions/InstructionConstants"));

var ControlUnit =
/** @class */
function (_super) {
  __extends(ControlUnit, _super);

  function ControlUnit(x, y) {
    var _this = _super.call(this, x, y) || this;

    _this.instrValue = Value_1.VAL_ZERO_32b;

    _this.refresh();

    return _this;
  }

  ControlUnit.prototype.draw = function (g) {// g.fillRect(this.x - 5, this.y - 5, 10, 10, Config.signalColor, Config.signalColor);
  };

  ControlUnit.prototype.refresh = function () {
    this.instrValue = undefined;
    this.branchValue = undefined;
    this.markBranch = undefined;
  };

  ControlUnit.prototype.forwardSignal = function (signaler, value) {
    switch (signaler) {
      case this._instrNode:
        {
          this.instrValue = value;
          break;
        }

      case this._branchNode:
        {
          this.branchValue = value;
          break;
        }

      default:
        {
          console.error("Error");
        }
    }

    if (this.instrValue == undefined || this.branchValue == undefined) {
      return;
    }

    var opcode = InstructionHelper_1.default.getOpCodeStr(this.instrValue);
    var ImmSel, Op2Sel, FuncSel, MemWr, RFWen, WBSel, WASel, PCSel;

    switch (opcode) {
      case InstructionConstants_1.default.OP_CODE_ALU:
        {
          ImmSel = undefined;
          Op2Sel = Value_1.VAL_ZERO_32b;
          FuncSel = ALUControl_1.default.FUNC;
          MemWr = DataMemory_1.default.WRITE_NO;
          RFWen = RegisterFile_1.default.WRITE_YES;
          WBSel = Value_1.VAL_TWO_32b;
          WASel = Value_1.VAL_ONE_32b;
          PCSel = Value_1.VAL_THREE_32b;
          break;
        }

      case InstructionConstants_1.default.OP_CODE_ALUI:
        {
          ImmSel = ImmSelect_1.default.ITYPE;
          Op2Sel = Value_1.VAL_ONE_32b;
          FuncSel = ALUControl_1.default.OP;
          MemWr = DataMemory_1.default.WRITE_NO;
          RFWen = RegisterFile_1.default.WRITE_YES;
          WBSel = Value_1.VAL_TWO_32b;
          WASel = Value_1.VAL_ONE_32b;
          PCSel = Value_1.VAL_THREE_32b;
          break;
        }

      case InstructionConstants_1.default.OP_CODE_LW:
        {
          ImmSel = ImmSelect_1.default.ITYPE;
          Op2Sel = Value_1.VAL_ONE_32b;
          FuncSel = ALUControl_1.default.ADD;
          MemWr = DataMemory_1.default.WRITE_NO;
          RFWen = RegisterFile_1.default.WRITE_YES;
          WBSel = Value_1.VAL_ONE_32b;
          WASel = Value_1.VAL_ONE_32b;
          PCSel = Value_1.VAL_THREE_32b;
          break;
        }

      case InstructionConstants_1.default.OP_CODE_SW:
        {
          ImmSel = ImmSelect_1.default.BSTYPE;
          Op2Sel = Value_1.VAL_ONE_32b;
          FuncSel = ALUControl_1.default.ADD;
          MemWr = DataMemory_1.default.WRITE_YES;
          RFWen = RegisterFile_1.default.WRITE_NO;
          WBSel = undefined;
          WASel = undefined;
          PCSel = Value_1.VAL_THREE_32b;
          break;
        }

      case InstructionConstants_1.default.OP_CODE_BRANCH:
        {
          ImmSel = ImmSelect_1.default.BRTYPE;
          Op2Sel = undefined;
          FuncSel = undefined;
          MemWr = DataMemory_1.default.WRITE_NO;
          RFWen = RegisterFile_1.default.WRITE_NO;
          WBSel = undefined;
          WASel = undefined;
          PCSel = this.branchValue == BranchLogic_1.default.BRANCH_TRUE ? Value_1.VAL_ZERO_32b : Value_1.VAL_THREE_32b;
          this.markBranch = true;
          break;
        }

      case InstructionConstants_1.default.OP_CODE_JAL:
        {
          ImmSel = undefined;
          Op2Sel = undefined;
          FuncSel = undefined;
          MemWr = DataMemory_1.default.WRITE_NO;
          RFWen = RegisterFile_1.default.WRITE_YES;
          WBSel = Value_1.VAL_ZERO_32b;
          WASel = Value_1.VAL_ZERO_32b;
          PCSel = Value_1.VAL_TWO_32b;
          break;
        }

      case InstructionConstants_1.default.OP_CODE_JALR:
        {
          ImmSel = undefined;
          Op2Sel = undefined;
          FuncSel = undefined;
          MemWr = DataMemory_1.default.WRITE_NO;
          RFWen = RegisterFile_1.default.WRITE_YES;
          WBSel = Value_1.VAL_ZERO_32b;
          WASel = Value_1.VAL_ONE_32b;
          PCSel = Value_1.VAL_ONE_32b;
          break;
        }

      default:
        {
          console.error("Unknown OP Code: " + opcode);
          PCSel = Value_1.VAL_THREE_32b;
        }
    }

    if (ImmSel) this._ImmSel.forwardSignal(this, ImmSel);
    if (Op2Sel) this._Op2Sel.forwardSignal(this, Op2Sel);
    if (FuncSel) this._FuncSel.forwardSignal(this, FuncSel);
    if (MemWr) this._MemWrite.forwardSignal(this, MemWr);
    if (RFWen) this._RegWriteEn.forwardSignal(this, RFWen);
    if (WBSel) this._WBSel.forwardSignal(this, WBSel);
    if (WASel) this._WASel.forwardSignal(this, WASel);
    if (PCSel) this._PCSelNode.forwardSignal(this, PCSel);
  };

  ControlUnit.prototype.mark = function (caller) {
    this._instrNode.mark(this);

    if (this.markBranch) {
      this._branchNode.mark(this);
    }
  };

  Object.defineProperty(ControlUnit.prototype, "instrNode", {
    set: function set(node) {
      this._instrNode = node;
      node.addNeighbour(this);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ControlUnit.prototype, "branchNode", {
    set: function set(node) {
      this._branchNode = node;
      node.addNeighbour(this);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ControlUnit.prototype, "PCSelNode", {
    set: function set(node) {
      this._PCSelNode = node;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ControlUnit.prototype, "RegWriteEn", {
    set: function set(node) {
      this._RegWriteEn = node;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ControlUnit.prototype, "MemWrite", {
    set: function set(node) {
      this._MemWrite = node;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ControlUnit.prototype, "WBSel", {
    set: function set(node) {
      this._WBSel = node;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ControlUnit.prototype, "WASel", {
    set: function set(node) {
      this._WASel = node;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ControlUnit.prototype, "ImmSel", {
    set: function set(node) {
      this._ImmSel = node;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ControlUnit.prototype, "FuncSel", {
    set: function set(node) {
      this._FuncSel = node;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ControlUnit.prototype, "Op2Sel", {
    set: function set(node) {
      this._Op2Sel = node;
    },
    enumerable: true,
    configurable: true
  });
  return ControlUnit;
}(Component_1.default);

exports.default = ControlUnit;
},{"./Component":"components/Component.ts","../util/Value":"util/Value.ts","./ALUControl":"components/ALUControl.ts","./DataMemory":"components/DataMemory.ts","./RegisterFile":"components/RegisterFile.ts","../instructions/InstructionHelper":"instructions/InstructionHelper.ts","./ImmSelect":"components/ImmSelect.ts","./BranchLogic":"components/BranchLogic.ts","../instructions/InstructionConstants":"instructions/InstructionConstants.ts"}],"components/ConstValue.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Component_1 = __importDefault(require("./Component"));

var Graphics_1 = __importDefault(require("../util/Graphics"));

var Config_1 = __importDefault(require("../util/Config"));

var ConstValue =
/** @class */
function (_super) {
  __extends(ConstValue, _super);

  function ConstValue(x, y, value) {
    var _this = _super.call(this, x, y) || this;

    _this.value = value;
    return _this;
  }

  ConstValue.prototype.draw = function (g) {
    g.fillPolygon(Graphics_1.default.addOffset([[0, 0], [0, 25], [25, 25], [25, 0]], this.x, this.y), Config_1.default.elementFillColor, Config_1.default.elementStrokeColor);
    g.drawText(this.x + 5, this.y + 20, this.value.asShortHexString(), Config_1.default.fontColor, Config_1.default.fontSize);
  };

  ConstValue.prototype.onFallingEdge = function () {
    this._outNode.forwardSignal(this, this.value);
  };

  ConstValue.prototype.mark = function (caller) {// TODO: change color
  };

  Object.defineProperty(ConstValue.prototype, "outNode", {
    set: function set(value) {
      this._outNode = value;
    },
    enumerable: true,
    configurable: true
  });
  return ConstValue;
}(Component_1.default);

exports.default = ConstValue;
},{"./Component":"components/Component.ts","../util/Graphics":"util/Graphics.ts","../util/Config":"util/Config.ts"}],"Simulator.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) {
    if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  }
  result["default"] = mod;
  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Graphics_1 = __importDefault(require("./util/Graphics"));

var ArithmeticLogicUnit_1 = __importDefault(require("./components/ArithmeticLogicUnit"));

var Register_1 = __importDefault(require("./components/Register"));

var CircutNode_1 = __importDefault(require("./components/CircutNode"));

var Config_1 = __importDefault(require("./util/Config"));

var InstructionMemory_1 = __importDefault(require("./components/InstructionMemory"));

var Multiplexer_1 = __importStar(require("./components/Multiplexer"));

var ControlUnit_1 = __importDefault(require("./components/ControlUnit"));

var ConstValue_1 = __importDefault(require("./components/ConstValue"));

var RegisterFile_1 = __importDefault(require("./components/RegisterFile"));

var ImmSelect_1 = __importDefault(require("./components/ImmSelect"));

var ALUControl_1 = __importDefault(require("./components/ALUControl"));

var DataMemory_1 = __importDefault(require("./components/DataMemory"));

var Value_1 = __importDefault(require("./util/Value"));

var BranchLogic_1 = __importDefault(require("./components/BranchLogic"));

var Simulator =
/** @class */
function () {
  function Simulator(canvas, parsed) {
    this.elements = [];
    this.g = new Graphics_1.default(canvas, 1200, 800);
    this.load(parsed);
  }

  Simulator.prototype.create = function () {
    var controlUnit = new ControlUnit_1.default(0, 0);
    var PCRegister = new Register_1.default(50, 50);
    var instrMemory = new InstructionMemory_1.default(10, 100, this.initialInstruct);
    var PCStepVal = new ConstValue_1.default(350, 135, Value_1.default.fromUnsignedInt(4));
    var PCAdder = new ArithmeticLogicUnit_1.default(405, 135, ArithmeticLogicUnit_1.default.ADD);
    var PCSelMux = new Multiplexer_1.default(410, 25, 4, Multiplexer_1.MultiplexerOrientation.LEFT);
    this.elements.push(PCRegister, instrMemory, PCStepVal, PCSelMux, PCAdder, controlUnit);
    var WASel1 = new ConstValue_1.default(325, 520, Value_1.default.fromUnsignedInt(1));
    var WASelMux = new Multiplexer_1.default(360, 520, 2);
    var registerFile = new RegisterFile_1.default(425, 260);
    var immSelect = new ImmSelect_1.default(625, 550);
    var ALUCtrl = new ALUControl_1.default(740, 630);
    this.elements.push(WASel1, registerFile, WASelMux, immSelect, ALUCtrl);
    var op2SelMux = new Multiplexer_1.default(850, 500, 2);
    var ALU = new ArithmeticLogicUnit_1.default(895, 400);
    this.elements.push(op2SelMux, ALU);
    var dataMemory = new DataMemory_1.default(985, 200);
    var WBSelMux = new Multiplexer_1.default(1135, 600, 3);
    this.elements.push(dataMemory, WBSelMux);
    var branchAdder = new ArithmeticLogicUnit_1.default(800, 210, ArithmeticLogicUnit_1.default.ADD);
    var branchLogic = new BranchLogic_1.default(670, 275);
    this.elements.push(branchAdder, branchLogic);
    /* PC enable write */

    var node = new CircutNode_1.default(70, 50, Value_1.default.fromUnsignedInt(1));
    PCRegister.writeEnable = node;
    this.elements.push(node); // Not required

    var path;
    /* PCSelMux ->  PC */

    path = this.createPath([[410, 72.5], [375, 72.5], [375, 40], [30, 40], [30, 62.5], [50, 62.5]]);
    PCSelMux.outNode = path[0];
    PCRegister.inputNode = path[path.length - 1];
    /* PC Step -> PC Adder */

    path = this.createPath([[375, 147.5], [405, 147.5]]);
    PCStepVal.outNode = path[0];
    PCAdder.input1Node = path[path.length - 1];
    /* PC Register -> PC Adder */

    path = this.createPath([[200, 62.5], [220, 62.5], [275, 62.5], [325, 62.5], [325, 197.5], [405, 197.5]]);
    PCRegister.outNode = path[0];
    PCAdder.input2Node = path[path.length - 1];
    var PCRegisterNode1 = path[1];
    var PCRegisterNode2 = path[2];
    /* PC Adder -> PCSelMux */

    path = this.createPath([[445, 172.5], [455, 172.5], [455, 95], [435, 95]]);
    PCAdder.resultNode = path[0];
    PCSelMux.setInputNode(3, path[path.length - 1]);
    /* PC Register -> Instruction memory */

    path = this.createPath([[220, 85], [125, 85], [125, 100]]);
    PCRegisterNode1.addNeighbour(path[0]);
    instrMemory.addressNode = path[path.length - 1];
    /* Instruction memory -> instrNode */

    path = this.createPath([[240, 425], [305, 425]]);
    instrMemory.outputDataNode = path[0];
    var instrNode = path[path.length - 1];
    /* Instr node for Control unit */

    controlUnit.instrNode = instrNode;
    /* WASel1 -> WASelMux */

    path = this.createPath([[350, 532.5], [360, 532.5]]);
    WASel1.outNode = path[1];
    WASelMux.setInputNode(0, path[path.length - 1]);
    /* WASelMux -> Register File */

    path = this.createPath([[385, 552.5], [425, 552.5]]);
    WASelMux.outNode = path[0];
    registerFile.inputWriteSelNode = path[path.length - 1];
    /* instrNode -> RF Write select */

    path = this.createPath([[305, 570], [360, 570]]);
    instrNode.addNeighbour(path[0]);
    var instrNodeBottom = path[0];
    WASelMux.setInputNode(1, path[path.length - 1]);
    /* instrNode -> ImmSelect */

    path = this.createPath([[305, 620], [600, 620], [600, 575], [625, 575]]);
    instrNodeBottom.addNeighbour(path[0]);
    instrNodeBottom = path[0];
    immSelect.instrNode = path[path.length - 1];
    /* instrNode -> ALU Control */

    path = this.createPath([[305, 655], [740, 655]]);
    instrNodeBottom.addNeighbour(path[0]);
    instrNodeBottom = path[0];
    ALUCtrl.instrNode = path[path.length - 1];
    /* instrNode -> DataMemory */

    path = this.createPath([[305, 690], [985, 690]]);
    instrNodeBottom.addNeighbour(path[0]);
    dataMemory.instrNode = path[path.length - 1];
    /* instrNode -> ReadSel2 */

    path = this.createPath([[305, 390], [425, 390]]);
    instrNode.addNeighbour(path[0]);
    var instrNodeTop = path[0];
    registerFile.readSel2Node = path[path.length - 1];
    /* instrNode -> ReadSel1 */

    path = this.createPath([[305, 370], [425, 370]]);
    instrNodeTop.addNeighbour(path[0]);
    instrNodeTop = path[0];
    registerFile.readSel1Node = path[path.length - 1];
    /* ImmSelect -> op2SelMux */

    path = this.createPath([[725, 575], [790, 575], [790, 550], [850, 550]]);
    immSelect.outNode = path[0];
    op2SelMux.setInputNode(1, path[path.length - 1]);
    var immSelectNode = path[2];
    /* RF ReadData2 -> op2SelMux */

    path = this.createPath([[575, 390], [670, 390], [670, 525], [745, 525], [830, 525], [850, 525]]);
    registerFile.readData2Node = path[0];
    op2SelMux.setInputNode(0, path[path.length - 1]);
    var readData2Node = path[path.length - 2];
    var readData2BranchNode = path[3];
    /* RF ReadData1 -> ALU */

    path = this.createPath([[575, 370], [695, 370], [885, 370], [885, 415], [895, 415]]);
    registerFile.readData1Node = path[0];
    ALU.input1Node = path[path.length - 1];
    var readData1BranchNode = path[1];
    /* op2SelMux -> ALU */

    path = this.createPath([[875, 532.5], [885, 532.5], [885, 460], [895, 460]]);
    op2SelMux.outNode = path[0];
    ALU.input2Node = path[path.length - 1];
    /* ALU Control -> ALU */

    path = this.createPath([[840, 655], [915, 655], [915, 467.5]]);
    ALUCtrl.outNode = path[0];
    ALU.selOpNode = path[path.length - 1];
    /* ALU -> WBSel Mux */

    path = this.createPath([[935, 437.5], [960, 437.5], [960, 710], [1110, 710], [1110, 655], [1135, 655]]);
    ALU.resultNode = path[0];
    WBSelMux.setInputNode(2, path[path.length - 1]);
    var ALUoutNode = path[1];
    /* ALU -> DataMemory */

    path = this.createPath([[960, 300], [985, 300]]);
    ALUoutNode.addNeighbour(path[0]);
    dataMemory.addressNode = path[path.length - 1];
    /* DataMemory - > WBSel Mux */

    path = this.createPath([[1085, 640], [1135, 640]]);
    dataMemory.outputDataNode = path[0];
    WBSelMux.setInputNode(1, path[path.length - 1]);
    /* WBSel Mux -> RF WriteData */

    path = this.createPath([[1160, 640], [1180, 640], [1180, 730], [405, 730], [405, 590], [425, 590]]);
    WBSelMux.outNode = path[0];
    registerFile.inputWriteDataNode = path[path.length - 1];
    /* RF ReadData2 -> DataMemory */

    path = this.createPath([[830, 610], [985, 610]]);
    readData2Node.addNeighbour(path[0]);
    dataMemory.inputDataNode = path[path.length - 1];
    /* PC -> branchAdder */

    path = this.createPath([[275, 222.5], [800, 222.5]]);
    PCRegisterNode2.addNeighbour(path[0]);
    branchAdder.input1Node = path[path.length - 1];
    /* ImmSelect -> branchAdder */

    path = this.createPath([[790, 272.5], [800, 272.5]]);
    immSelectNode.addNeighbour(path[0]);
    branchAdder.input2Node = path[path.length - 1];
    /* branchAdder -> PCSel */

    path = this.createPath([[840, 247.5], [850, 247.5], [850, 50], [435, 50]]);
    branchAdder.resultNode = path[0];
    PCSelMux.setInputNode(0, path[path.length - 1]);
    /* readData1 -> Branch Logic */

    node = new CircutNode_1.default(695, 325);
    readData1BranchNode.addNeighbour(node);
    branchLogic.data1Node = node;
    this.elements.push(node);
    /* readData2 -> Branch Logic */

    node = new CircutNode_1.default(745, 325);
    readData2BranchNode.addNeighbour(node);
    branchLogic.data2Node = node;
    this.elements.push(node);
    /* instrNode -> Branch Select */

    branchLogic.instrNode = instrNodeTop;
    /* Branch Logic -> Control Unit */

    node = new CircutNode_1.default(770, 300);
    branchLogic.outNode = node;
    controlUnit.branchNode = node;
    this.elements.push(node);
    /*
     *Control signals
     */

    /* PCSel */

    path = this.createPath([[422.5, 10], [422.5, 32.5]]);
    controlUnit.PCSelNode = path[0];
    PCSelMux.selInputNode = path[path.length - 1];
    /* RegEnWrite */

    path = this.createPath([[550, 10], [550, 260]]);
    controlUnit.RegWriteEn = path[0];
    registerFile.inputWriteEnNode = path[path.length - 1];
    /* MemWrite */

    path = this.createPath([[1010, 10], [1010, 200]]);
    controlUnit.MemWrite = path[0];
    dataMemory.writeEnNode = path[path.length - 1];
    /* WBSel */

    path = this.createPath([[1147.5, 10], [1147.5, 607.5]]);
    controlUnit.WBSel = path[0];
    WBSelMux.selInputNode = path[path.length - 1];
    /* WASel */

    path = this.createPath([[372.5, 790], [372.5, 577.5]]);
    controlUnit.WASel = path[0];
    WASelMux.selInputNode = path[path.length - 1];
    /* ImmSel */

    path = this.createPath([[675, 790], [675, 600]]);
    controlUnit.ImmSel = path[0];
    immSelect.controlNode = path[path.length - 1];
    /* FuncSel */

    path = this.createPath([[790, 790], [790, 680]]);
    controlUnit.FuncSel = path[0];
    ALUCtrl.controlNode = path[path.length - 1];
    /* Op2Sel */

    path = this.createPath([[862.5, 790], [862.5, 557.5]]);
    controlUnit.Op2Sel = path[0];
    op2SelMux.selInputNode = path[path.length - 1];
  };

  Simulator.prototype.createPath = function (path) {
    var _this = this;

    var pathNodes = [];
    pathNodes.push(new CircutNode_1.default(path[0][0], path[0][1]));
    var last = pathNodes[0];

    for (var i = 1; i < path.length; i++) {
      var node = new CircutNode_1.default(path[i][0], path[i][1]);
      last.addNeighbour(node);
      pathNodes.push(node);
      last = node;
    }

    pathNodes.forEach(function (el) {
      return _this.elements.push(el);
    });
    return pathNodes;
  };

  Simulator.prototype.draw = function () {
    var _this = this;

    this.g.rescale();
    this.g.clear(Config_1.default.backgroundColor); // this.g.fillRect(0, 0, 1200, 800, "#00000000", "red");

    this.elements.forEach(function (el) {
      return el.draw(_this.g);
    });
  };

  Simulator.prototype.step = function () {
    console.log("Step");
    this.elements.forEach(function (el) {
      return el.refresh();
    });
    this.elements.forEach(function (el) {
      return el.onFallingEdge();
    });
    this.elements.forEach(function (el) {
      return el.onRisingEdge();
    });
    this.draw();
  };

  Simulator.prototype.load = function (parsed) {
    this.initialInstruct = parsed;
    this.reset();
  };

  Simulator.prototype.reset = function () {
    this.elements = [];
    this.create();
    this.step();
  };

  return Simulator;
}();

exports.default = Simulator;
},{"./util/Graphics":"util/Graphics.ts","./components/ArithmeticLogicUnit":"components/ArithmeticLogicUnit.ts","./components/Register":"components/Register.ts","./components/CircutNode":"components/CircutNode.ts","./util/Config":"util/Config.ts","./components/InstructionMemory":"components/InstructionMemory.ts","./components/Multiplexer":"components/Multiplexer.ts","./components/ControlUnit":"components/ControlUnit.ts","./components/ConstValue":"components/ConstValue.ts","./components/RegisterFile":"components/RegisterFile.ts","./components/ImmSelect":"components/ImmSelect.ts","./components/ALUControl":"components/ALUControl.ts","./components/DataMemory":"components/DataMemory.ts","./util/Value":"util/Value.ts","./components/BranchLogic":"components/BranchLogic.ts"}],"util/Parser.ts":[function(require,module,exports) {
"use strict";

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) {
    if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  }
  result["default"] = mod;
  return result;
};

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Value_1 = __importStar(require("./Value"));

var InstructionMemory_1 = __importDefault(require("../components/InstructionMemory"));

var Parser =
/** @class */
function () {
  function Parser() {}

  Parser.parse = function (textContent) {
    var ret = [];
    var lines = textContent.split('\n');

    for (var i = 0; i < lines.length; i++) {
      ret.push(Value_1.default.HexString(lines[i]));
    }

    while (ret.length < InstructionMemory_1.default.SIZE) {
      ret.push(Value_1.VAL_ZERO_32b);
    }

    return ret;
  };

  return Parser;
}();

exports.default = Parser;
},{"./Value":"util/Value.ts","../components/InstructionMemory":"components/InstructionMemory.ts"}],"util/util.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function toggleFullScreen() {
  var documentBody = document.body;

  if (!this.isFullScreen) {
    // @ts-ignoreç
    if (documentBody.requestFullScreen) {
      // @ts-ignoreç
      documentBody.requestFullScreen(); // @ts-ignoreç
    } else if (documentBody.webkitRequestFullscreen) {
      // @ts-ignoreç
      documentBody.webkitRequestFullscreen(); // @ts-ignoreç
    } else if (documentBody.mozRequestFullScreen) {
      // @ts-ignoreç
      documentBody.mozRequestFullScreen(); // @ts-ignoreç
    } else if (documentBody.msRequestFullscreen) {
      // @ts-ignoreç
      documentBody.msRequestFullscreen();
    }

    this.isFullScreen = true;
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen(); // @ts-ignoreç
    } else if (document.msExitFullscreen) {
      // @ts-ignoreç
      document.msExitFullscreen(); // @ts-ignoreç
    } else if (document.mozCancelFullScreen) {
      // @ts-ignorec
      document.mozCancelFullScreen(); // @ts-ignoreç
    } else if (document.webkitExitFullscreen) {
      // @ts-ignoreç
      document.webkitExitFullscreen();
    }

    this.isFullScreen = false;
  }
}

exports.toggleFullScreen = toggleFullScreen;
},{}],"main.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Simulator_1 = __importDefault(require("./Simulator"));

var Parser_1 = __importDefault(require("./util/Parser"));

var util_1 = require("./util/util");

var Value_1 = __importDefault(require("./util/Value"));

var canvas = document.getElementById("sim-canvas");
var menuBar = document.getElementById("menu");
var btnStep = document.getElementById("btn-step");
var btnPlay = document.getElementById("btn-play");
var btnPause = document.getElementById("btn-pause");
var txtCode = document.getElementById("txt-code");
var btnLoad = document.getElementById("btn-load");
var btnReset = document.getElementById("btn-reset");
var sim = new Simulator_1.default(canvas, Parser_1.default.parse(txtCode.textContent));
var play = false;

var resize = function resize() {
  canvas.style.width = document.body.clientWidth + "px";
  canvas.style.height = document.body.clientHeight - menuBar.clientHeight + "px";
  sim.draw();
};

resize();
window.addEventListener("resize", function () {
  return resize();
});
Value_1.default.main();
window.addEventListener("keydown", function (evt) {
  switch (evt.key) {
    case "s":
    case "S":
      {
        sim.step();
        break;
      }

    case "r":
    case "R":
      {
        sim.reset();
        break;
      }

    case "f":
    case "F":
      {
        util_1.toggleFullScreen();
        break;
      }

    case "ArrowRight":
      console.log("->");
  }
});
btnStep.addEventListener("click", function (evt) {
  sim.step();
  btnPause.click();
});
btnPlay.addEventListener("click", function (evt) {
  play = true;
  btnPlay.disabled = true;
  btnPause.disabled = false;
});
btnPause.addEventListener("click", function (evt) {
  play = false;
  btnPlay.disabled = false;
  btnPause.disabled = true;
});
btnLoad.addEventListener("click", function (evt) {
  var parsed = Parser_1.default.parse(txtCode.textContent);
  if (parsed) sim.load(parsed);
});
btnReset.addEventListener("click", function (evt) {
  return sim.reset();
});
setInterval(function () {
  if (play) {
    sim.step();
  }
}, 100);
},{"./Simulator":"Simulator.ts","./util/Parser":"util/Parser.ts","./util/util":"util/util.ts","./util/Value":"util/Value.ts"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "56055" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","main.ts"], null)
//# sourceMappingURL=/main.c39d6dcf.map