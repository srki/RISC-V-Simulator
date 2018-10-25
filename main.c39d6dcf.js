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
})({"Graphics.ts":[function(require,module,exports) {
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

  Graphics.prototype.drawLine = function (x1, y1, x2, y2, color) {
    this.ctx.strokeStyle = color;
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
  };

  Graphics.prototype.drawPath = function (path, strokeStyle) {
    this.ctx.strokeStyle = strokeStyle;
    this.ctx.beginPath();
    this.ctx.moveTo(path[0][0], path[0][1]);

    for (var i = 1; i < path.length; i++) {
      this.ctx.lineTo(path[i][0], path[i][1]);
    }

    this.ctx.stroke();
  };

  Graphics.prototype.fillRect = function (x, y, w, h, fillStyle, strokeStyle) {
    this.fillPolygon([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], fillStyle, strokeStyle);
  };

  Graphics.prototype.fillPolygon = function (point, fillStyle, strokeStyle) {
    this.ctx.fillStyle = fillStyle;
    this.ctx.strokeStyle = strokeStyle;
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
},{}],"Component.ts":[function(require,module,exports) {
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
},{}],"Config.ts":[function(require,module,exports) {
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
  Config.signalColor = "#4a484e";
  Config.fontColor = "#000000";
  Config.fontSize = 20;
  return Config;
}();

exports.default = Config;
},{}],"Val.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Val =
/** @class */
function () {
  function Val(val, num_bits) {
    if (val === void 0) {
      val = 0;
    }

    this.num_bits = num_bits;
    this.val = val;
  }

  Val.mod = function (n, m) {
    return (n % m + m) % m;
  };

  Val.UnsignedInt = function (val, num_bits) {
    if (num_bits === void 0) {
      num_bits = 32;
    }

    return new Val(Val.mod(val, Math.pow(2, num_bits)), num_bits);
  };

  Val.prototype.asUnsignedInt = function () {
    return this.val;
  };

  Val.SignedInt = function (val, num_bits) {
    if (num_bits === void 0) {
      num_bits = 32;
    }

    var max_signed = Math.pow(2, num_bits - 1) - 1;
    if (val >= 0) return new Val(Val.mod(val, max_signed), num_bits);
    if (val < 0) return new Val(max_signed + 1 - Val.mod(val, max_signed), num_bits);
  };

  Val.prototype.asSignedInt = function () {
    var max_signed = Math.pow(2, this.num_bits - 1) - 1;
    if (this.val <= max_signed) return this.val;
    return -(this.val - (max_signed + 1));
  };

  Val.prototype.asHexString = function () {
    var str = this.asUnsignedInt().toString(16);

    while (str.length < this.num_bits / 4) {
      str = "0" + str;
    }

    return "0x" + str.toUpperCase();
  };

  Val.prototype.asBinaryString = function () {
    var str = this.asUnsignedInt().toString(2);

    while (str.length < this.num_bits) {
      str = "0" + str;
    }

    return str;
  };

  Val.prototype.asShortHexString = function () {
    return this.asUnsignedInt().toString(16).toLocaleUpperCase();
  };

  Val.prototype.getNumBits = function () {
    return this.num_bits;
  }; // TODO: check if the implementations are correct


  Val.add = function (lhs, rhs) {
    return new Val(lhs.asUnsignedInt() + rhs.asUnsignedInt(), 32);
  };

  Val.sub = function (lhs, rhs) {
    return new Val(lhs.asUnsignedInt() - rhs.asUnsignedInt(), 32);
  };

  Val.and = function (lhs, rhs) {
    return new Val(lhs.asUnsignedInt() & rhs.asUnsignedInt(), 32);
  };

  Val.or = function (lhs, rhs) {
    return new Val(lhs.asUnsignedInt() | rhs.asUnsignedInt(), 32);
  };

  Val.xor = function (lhs, rhs) {
    return new Val(lhs.asUnsignedInt() ^ rhs.asUnsignedInt(), 32);
  };

  Val.shiftLeftLogical = function (lhs, rhs) {
    return new Val(lhs.asUnsignedInt() << rhs.asUnsignedInt(), 32);
  };

  Val.shiftRightLogical = function (lhs, rhs) {
    return new Val(lhs.asUnsignedInt() >>> rhs.asUnsignedInt(), 32);
  };

  Val.shiftRightArithmetic = function (lhs, rhs) {
    return new Val(lhs.asUnsignedInt() >> rhs.asUnsignedInt(), 32);
  };

  Val.main = function () {
    console.log("hello world");
    console.log(this.UnsignedInt(12345).asSignedInt());
    console.log(this.UnsignedInt(-123).asSignedInt());
    console.log(this.UnsignedInt(123231).asSignedInt());
    console.log(this.UnsignedInt(123412).asSignedInt());
    console.log(this.UnsignedInt(Math.pow(2, 32)).asSignedInt());
    console.log(this.UnsignedInt(Math.pow(2, 32) - 1).asSignedInt());
    console.log(this.UnsignedInt(Math.pow(2, 32) + 1).asSignedInt());
    console.log(this.SignedInt(1).asSignedInt());
    console.log(this.SignedInt(0).asSignedInt());
    console.log(this.SignedInt(-1).asSignedInt());
    console.log(this.SignedInt(-1234567).asSignedInt());
    console.log(this.SignedInt(7654321).asSignedInt());
    console.log(this.SignedInt(999999999999999).asHexString());
  };

  Val.HexString = function (s, num_bits) {
    if (num_bits === void 0) {
      num_bits = 32;
    }

    return Val.UnsignedInt(parseInt(s, 16), num_bits);
  };

  return Val;
}();

exports.default = Val;
exports.VAL_ZERO_32b = Val.UnsignedInt(0, 32);
exports.VAL_ONE_32b = Val.UnsignedInt(1, 32);
exports.VAL_TWO_32b = Val.UnsignedInt(2, 32);
exports.VAL_THREE_32b = Val.UnsignedInt(3, 32);
exports.VAL_ZERO_0b = Val.UnsignedInt(0, 0);
exports.VAL_ZERO_5b = Val.UnsignedInt(0, 5);
},{}],"ArithmeticLogicUnit.ts":[function(require,module,exports) {
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

var Graphics_1 = __importDefault(require("./Graphics"));

var Config_1 = __importDefault(require("./Config"));

var Val_1 = __importStar(require("./Val"));

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
    _this.input1Value = Val_1.VAL_ZERO_32b;
    _this.input2Value = Val_1.VAL_ZERO_0b;
    _this.selOpValue = Val_1.VAL_ZERO_5b;
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
          result = Val_1.default.add(this.input1Value, this.input2Value);
          break;
        }

      case ArithmeticLogicUnit.SUB:
        {
          result = Val_1.default.sub(this.input1Value, this.input2Value);
          break;
        }

      case ArithmeticLogicUnit.AND:
        {
          result = Val_1.default.and(this.input1Value, this.input2Value);
          break;
        }

      case ArithmeticLogicUnit.OR:
        {
          result = Val_1.default.or(this.input1Value, this.input2Value);
          break;
        }

      case ArithmeticLogicUnit.XOR:
        {
          result = Val_1.default.xor(this.input1Value, this.input2Value);
          break;
        }

      case ArithmeticLogicUnit.SLL:
        {
          result = Val_1.default.shiftLeftLogical(this.input1Value, this.input2Value);
          break;
        }

      case ArithmeticLogicUnit.SRL:
        {
          result = Val_1.default.shiftRightLogical(this.input1Value, this.input2Value);
          break;
        }

      case ArithmeticLogicUnit.SRA:
        {
          result = Val_1.default.shiftRightArithmetic(this.input1Value, this.input2Value);
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
          result = Val_1.VAL_ZERO_32b;
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

  ArithmeticLogicUnit.ADD = new Val_1.default(0, 4);
  /* Addition               */

  ArithmeticLogicUnit.SUB = new Val_1.default(1, 4);
  /* Subtraction            */

  ArithmeticLogicUnit.AND = new Val_1.default(2, 4);
  /* Bitwise AND            */

  ArithmeticLogicUnit.OR = new Val_1.default(3, 4);
  /* Bitwise OR             */

  ArithmeticLogicUnit.XOR = new Val_1.default(4, 4);
  /* Bitwise XOR            */

  ArithmeticLogicUnit.SLL = new Val_1.default(5, 4);
  /* Shift Left Logical     */

  ArithmeticLogicUnit.SRL = new Val_1.default(6, 4);
  /* Shift Right Logical    */

  ArithmeticLogicUnit.SRA = new Val_1.default(7, 4);
  /* Shift Right Arithmetic */

  ArithmeticLogicUnit.SLT = new Val_1.default(8, 4);
  /* Shift Right Arithmetic */

  ArithmeticLogicUnit.SLTU = new Val_1.default(9, 4);
  /* Shift Right Arithmetic */

  return ArithmeticLogicUnit;
}(Component_1.default);

exports.default = ArithmeticLogicUnit;
},{"./Component":"Component.ts","./Graphics":"Graphics.ts","./Config":"Config.ts","./Val":"Val.ts"}],"Register.ts":[function(require,module,exports) {
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

var Config_1 = __importDefault(require("./Config"));

var Val_1 = require("./Val");

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
    _this.value = Val_1.VAL_ZERO_32b;
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
},{"./Component":"Component.ts","./Config":"Config.ts","./Val":"Val.ts"}],"CircutNode.ts":[function(require,module,exports) {
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

var Config_1 = __importDefault(require("./Config"));

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
},{"./Component":"Component.ts","./Config":"Config.ts"}],"InstructionHelper.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Val_1 = __importDefault(require("./Val"));

var InstructionHelper =
/** @class */
function () {
  function InstructionHelper() {}
  /* @formatter:on */


  InstructionHelper.convertAndPad = function (num, len) {
    if (len === void 0) {
      len = 32;
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

  InstructionHelper.createRType = function (opCode, funct, rd, rs1, rs2) {
    var funct7 = funct.substr(0, 7);
    var funct3 = funct.substr(7, 3);
    var instr = funct7 + this.convertAndPad(rs2, 5) + this.convertAndPad(rs1, 5) + funct3 + this.convertAndPad(rd, 5) + opCode;
    return new Val_1.default(parseInt(instr, 2), 32);
  };

  InstructionHelper.createIType = function (opCode, funct, rd, rs1, imm) {
    var instr = this.convertAndPad(imm, 12) + this.convertAndPad(rs1, 5) + funct + this.convertAndPad(rd, 5) + opCode;
    return new Val_1.default(parseInt(instr, 2), 32);
  };

  InstructionHelper.createITypeShift = function (opCode, funct, rd, rs1, shamt) {
    var funct7 = funct.substr(0, 7);
    var funct3 = funct.substr(7, 3);
    var instr = funct7 + this.convertAndPad(shamt, 5) + this.convertAndPad(rs1, 5) + funct3 + this.convertAndPad(rd, 5) + opCode;
    return new Val_1.default(parseInt(instr, 2), 32);
  };

  InstructionHelper.createSType = function (opCode, funct, rs1, rs2, imm) {
    var immStr = this.convertAndPad(imm, 12);
    var imm11 = immStr.substr(0, 7);
    var imm4 = immStr.substr(7, 5);
    var instr = imm11 + this.convertAndPad(rs2, 5) + this.convertAndPad(rs1, 5) + funct + imm4 + opCode;
    return new Val_1.default(parseInt(instr, 2), 32);
  };

  InstructionHelper.createBType = function (opCode, funct, rs1, rs2, imm) {
    var immStr = this.convertAndPad(imm, 12);
    var imm12 = immStr.substr(0, 1);
    var imm10 = immStr.substr(2, 6);
    var imm4 = immStr.substr(8, 4);
    var imm11 = immStr.substr(1, 1);
    var instr = imm12 + imm10 + this.convertAndPad(rs2, 5) + this.convertAndPad(rs1, 5) + funct + imm4 + imm11 + opCode;
    return new Val_1.default(parseInt(instr, 2), 32);
  };

  InstructionHelper.decode = function (instr) {
    var opCode = this.getOpCodeStr(instr);

    switch (opCode) {
      case this.OP_CODE_ALU:
        return this.decodeALU(instr);

      case this.OP_CODE_ALUI:
        return this.decodeALUI(instr);

      case this.OP_CODE_LW:
        return this.decodeLW(instr);

      case this.OP_CODE_SW:
        return this.decodeSW(instr);

      case this.OP_CODE_BRANCH:
        return this.decodeBRANCH(instr);

      case this.OP_CODE_JAL:
        return this.decodeJAL(instr);

      case this.OP_CODE_JALR:
        return this.decodeJALR(instr);

      default:
        console.error("Unsupported OP Code: " + opCode);
        return instr.asHexString();
    }
  };

  InstructionHelper.decodeALU = function (instr) {
    var func = instr.asBinaryString().substr(0, 7) + instr.asBinaryString().substr(17, 3);
    var name = "-";

    switch (func) {
      case this.FUNCT_ADD:
        {
          name = "ADD";
          break;
        }

      case this.FUNCT_SUB:
        {
          name = "SUB";
          break;
        }

      case this.FUNCT_SLL:
        {
          name = "SLT";
          break;
        }

      case this.FUNCT_SLT:
        {
          name = "SLT";
          break;
        }

      case this.FUNCT_SLTIU:
        {
          name = "SLTU";
          break;
        }

      case this.FUNCT_XOR:
        {
          name = "XOR";
          break;
        }

      case this.FUNCT_SRL:
        {
          name = "SRL";
          break;
        }

      case this.FUNCT_SRA:
        {
          name = "SRA";
          break;
        }

      case this.FUNCT_OR:
        {
          name = "OR";
          break;
        }

      case this.FUNCT_AND:
        {
          name = "";
          break;
        }
    }

    return name + " x" + this.getRd(instr) + ", x" + this.getRs1(instr) + ", x" + this.getRs2(instr);
  };

  InstructionHelper.decodeALUI = function (instr) {
    var func7 = instr.asBinaryString().substr(0, 7);
    var func3 = instr.asBinaryString().substr(17, 3);
    var name = "-";

    switch (func3) {
      case this.FUNCT_ADDI:
        {
          name = "ADDI";
          break;
        }

      case this.FUNCT_SLTI:
        {
          name = "SLTI";
          break;
        }

      case this.FUNCT_SLTIU:
        {
          name = "SLTIU";
          break;
        }

      case this.FUNCT_XORI:
        {
          name = "XORI";
          break;
        }

      case this.FUNCT_ORI:
        {
          name = "ORI";
          break;
        }

      case this.FUNCT_ANDI:
        {
          name = "ANDI";
          break;
        }
    }

    switch (func7 + func3) {
      case this.FUNCT_SLLI:
        {
          name = "SSLI";
          break;
        }

      case this.FUNCT_SRLI:
        {
          name = "SRLI";
          break;
        }

      case this.FUNCT_SRAI:
        {
          name = "SRAI";
          break;
        }
    }

    return name + " x" + this.getRd(instr) + ", x" + this.getRs1(instr) + ", " + this.getImmIType(instr).toString(10);
  };

  InstructionHelper.decodeLW = function (instr) {
    var func = instr.asBinaryString().substr(17, 3);
    var name = "-";

    switch (func) {
      case this.FUNCT_LB:
        {
          name = "LB";
          break;
        }

      case this.FUNCT_LH:
        {
          name = "LH";
          break;
        }

      case this.FUNCT_LW:
        {
          name = "LW";
          break;
        }

      case this.FUNCT_LBU:
        {
          name = "LBU";
          break;
        }

      case this.FUNCT_LHU:
        {
          name = "LHU";
          break;
        }
    }

    return name + " x" + this.getRd(instr) + ", 0x" + this.getImmIType(instr).toString(16).toUpperCase() + "(x" + this.getRs1(instr) + ")";
  };

  InstructionHelper.decodeSW = function (instr) {
    var func = instr.asBinaryString().substr(17, 3);
    var name = "-";

    switch (func) {
      case this.FUNCT_SB:
        {
          name = "SW";
          break;
        }

      case this.FUNCT_SH:
        {
          name = "SW";
          break;
        }

      case this.FUNCT_SW:
        {
          name = "SW";
          break;
        }
    }

    return name + " x" + this.getRs1(instr) + ", 0x" + this.getImmIType(instr).toString(16).toUpperCase() + "(x" + this.getRs2(instr) + ")";
  };

  InstructionHelper.decodeBRANCH = function (instr) {
    var func = instr.asBinaryString().substr(17, 3);
    var name = "-";

    switch (func) {
      case this.FUNCT_BEQ:
        {
          name = "BEQ";
          break;
        }

      case this.FUNCT_BNE:
        {
          name = "BNE";
          break;
        }

      case this.FUNCT_BLT:
        {
          name = "BLT";
          break;
        }

      case this.FUNCT_BGE:
        {
          name = "BGE";
          break;
        }

      case this.FUNCT_BLTU:
        {
          name = "BLTU";
          break;
        }

      case this.FUNCT_BGEU:
        {
          name = "BGEU";
          break;
        }
    }

    return name + " x" + this.getRs1(instr) + ", x" + this.getRs2(instr) + ", 0x" + this.getImmBType(instr).toString(16).toUpperCase();
  };

  InstructionHelper.decodeJAL = function (instr) {
    return "JAL instruction";
  };

  InstructionHelper.decodeJALR = function (instr) {
    return "JALR instruction";
  };

  InstructionHelper.compare = function (v, s) {
    console.log(v.asBinaryString());
    console.log(s.replace(/ /g, ""));
  };

  InstructionHelper.main = function (args) {
    if (args === void 0) {
      args = [];
    }

    this.compare(this.createRType(this.OP_CODE_ALU, this.FUNCT_ADD, 2, 1, 1), "0000000 00001 00001 000 00010 0110011");
  };

  InstructionHelper.INSTR_SIZE = 32;
  InstructionHelper.OP_CODE_SIZE = 7;
  /* @formatter:off */

  InstructionHelper.OP_CODE_ALU = "0110011";
  InstructionHelper.OP_CODE_ALUI = "0010011";
  InstructionHelper.OP_CODE_LW = "0000011";
  InstructionHelper.OP_CODE_SW = "0100011";
  InstructionHelper.OP_CODE_BRANCH = "1100011";
  InstructionHelper.OP_CODE_JAL = "1101111";
  InstructionHelper.OP_CODE_JALR = "1100111";
  /* ALU Functions */

  InstructionHelper.FUNCT_ADD = "0000000000";
  InstructionHelper.FUNCT_SUB = "0100000000";
  InstructionHelper.FUNCT_SLL = "0000000001";
  InstructionHelper.FUNCT_SLT = "0000000010";
  InstructionHelper.FUNCT_SLTU = "0000000011";
  InstructionHelper.FUNCT_XOR = "0000000100";
  InstructionHelper.FUNCT_SRL = "0000000101";
  InstructionHelper.FUNCT_SRA = "0100000101";
  InstructionHelper.FUNCT_OR = "0000000110";
  InstructionHelper.FUNCT_AND = "0000000111";
  /* ALUi Functions */

  InstructionHelper.FUNCT_ADDI = "000";
  InstructionHelper.FUNCT_SLTI = "010";
  InstructionHelper.FUNCT_SLTIU = "011";
  InstructionHelper.FUNCT_XORI = "100";
  InstructionHelper.FUNCT_ORI = "110";
  InstructionHelper.FUNCT_ANDI = "111";
  InstructionHelper.FUNCT_SLLI = "0000000001";
  InstructionHelper.FUNCT_SRLI = "0000000101";
  InstructionHelper.FUNCT_SRAI = "0100000101";
  /* Load Functions */

  InstructionHelper.FUNCT_LB = "000";
  InstructionHelper.FUNCT_LH = "001";
  InstructionHelper.FUNCT_LW = "010";
  InstructionHelper.FUNCT_LBU = "100";
  InstructionHelper.FUNCT_LHU = "10";
  /* Store Functions */

  InstructionHelper.FUNCT_SB = "000";
  InstructionHelper.FUNCT_SH = "001";
  InstructionHelper.FUNCT_SW = "010";
  /* Branch Functions */

  InstructionHelper.FUNCT_BEQ = "000";
  InstructionHelper.FUNCT_BNE = "001";
  InstructionHelper.FUNCT_BLT = "100";
  InstructionHelper.FUNCT_BGE = "101";
  InstructionHelper.FUNCT_BLTU = "110";
  InstructionHelper.FUNCT_BGEU = "111";
  return InstructionHelper;
}();

exports.default = InstructionHelper;
},{"./Val":"Val.ts"}],"InstructionMemory.ts":[function(require,module,exports) {
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

var Config_1 = __importDefault(require("./Config"));

var InstructionHelper_1 = __importDefault(require("./InstructionHelper"));

var InstructionMemory =
/** @class */
function (_super) {
  __extends(InstructionMemory, _super);

  function InstructionMemory(x, y, values) {
    var _this = _super.call(this, x, y) || this;

    _this.values = [];
    _this.values = values;
    _this.values[0] = InstructionHelper_1.default.createIType(InstructionHelper_1.default.OP_CODE_ALUI, InstructionHelper_1.default.FUNCT_ADDI, 1, 0, 5);
    _this.values[1] = InstructionHelper_1.default.createIType(InstructionHelper_1.default.OP_CODE_ALUI, InstructionHelper_1.default.FUNCT_ADDI, 2, 0, 7);
    _this.values[2] = InstructionHelper_1.default.createRType(InstructionHelper_1.default.OP_CODE_ALU, InstructionHelper_1.default.FUNCT_ADD, 3, 1, 2);
    _this.values[3] = InstructionHelper_1.default.createIType(InstructionHelper_1.default.OP_CODE_ALUI, InstructionHelper_1.default.FUNCT_ADDI, 3, 3, 4);
    _this.values[4] = InstructionHelper_1.default.createRType(InstructionHelper_1.default.OP_CODE_ALU, InstructionHelper_1.default.FUNCT_SUB, 4, 3, 1);
    _this.values[5] = InstructionHelper_1.default.createRType(InstructionHelper_1.default.OP_CODE_ALU, InstructionHelper_1.default.FUNCT_ADD, 5, 4, 2);
    _this.values[6] = InstructionHelper_1.default.createITypeShift(InstructionHelper_1.default.OP_CODE_ALUI, InstructionHelper_1.default.FUNCT_SRLI, 6, 5, 1);
    return _this;
  }

  InstructionMemory.prototype.draw = function (g) {
    g.fillRect(this.x, this.y, 100, InstructionMemory.SIZE * 15 + 20, Config_1.default.elementFillColor, Config_1.default.elementStrokeColor);

    for (var i = 0; i < InstructionMemory.SIZE; i++) {
      g.fillRect(this.x + 10, this.y + 10 + i * 15, 80, 15, Config_1.default.memoryFillColor, Config_1.default.memoryStrokeColor);
      g.drawText(this.x + 10 + 5, this.y + 10 + 12 + i * 15, this.values[i].asHexString(), Config_1.default.fontColor, 12);
    }
  };

  InstructionMemory.prototype.forwardSignal = function (signaler, value) {
    this._outputDataNode.forwardSignal(this, this.values[value.asUnsignedInt() / 4]);
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
},{"./Component":"Component.ts","./Config":"Config.ts","./InstructionHelper":"InstructionHelper.ts"}],"Multiplexer.ts":[function(require,module,exports) {
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

var Graphics_1 = __importDefault(require("./Graphics"));

var Config_1 = __importDefault(require("./Config"));

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

  Multiplexer.prototype.setInputNodes = function (idx, node) {
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
},{"./Component":"Component.ts","./Graphics":"Graphics.ts","./Config":"Config.ts"}],"ALUControl.ts":[function(require,module,exports) {
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

var Config_1 = __importDefault(require("./Config"));

var Val_1 = __importDefault(require("./Val"));

var ArithmeticLogicUnit_1 = __importDefault(require("./ArithmeticLogicUnit"));

var InstructionHelper_1 = __importDefault(require("./InstructionHelper"));

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
          result = ALUControl.ADD;
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
      case InstructionHelper_1.default.FUNCT_ADD:
        return ArithmeticLogicUnit_1.default.ADD;

      case InstructionHelper_1.default.FUNCT_SUB:
        return ArithmeticLogicUnit_1.default.SUB;

      case InstructionHelper_1.default.FUNCT_SLL:
        return ArithmeticLogicUnit_1.default.SLL;

      case InstructionHelper_1.default.FUNCT_SLT:
        return ArithmeticLogicUnit_1.default.SLT;

      case InstructionHelper_1.default.FUNCT_SLTU:
        return ArithmeticLogicUnit_1.default.SLTU;

      case InstructionHelper_1.default.FUNCT_XOR:
        return ArithmeticLogicUnit_1.default.XOR;

      case InstructionHelper_1.default.FUNCT_SRL:
        return ArithmeticLogicUnit_1.default.XOR;

      case InstructionHelper_1.default.FUNCT_SRA:
        return ArithmeticLogicUnit_1.default.SRA;

      case InstructionHelper_1.default.FUNCT_OR:
        return ArithmeticLogicUnit_1.default.OR;

      case InstructionHelper_1.default.FUNCT_AND:
        return ArithmeticLogicUnit_1.default.AND;

      default:
        return null;
    }
  };

  ALUControl.prototype.handleOp = function () {
    var func7 = this.instrValue.asBinaryString().substr(0, 7);
    var func3 = this.instrValue.asBinaryString().substr(17, 3);

    switch (func3) {
      case InstructionHelper_1.default.FUNCT_ADDI:
        return ArithmeticLogicUnit_1.default.ADD;

      case InstructionHelper_1.default.FUNCT_SLTI:
        return ArithmeticLogicUnit_1.default.SLT;

      case InstructionHelper_1.default.FUNCT_SLTIU:
        return ArithmeticLogicUnit_1.default.SLTU;

      case InstructionHelper_1.default.FUNCT_XORI:
        return ArithmeticLogicUnit_1.default.XOR;

      case InstructionHelper_1.default.FUNCT_ORI:
        return ArithmeticLogicUnit_1.default.OR;

      case InstructionHelper_1.default.FUNCT_ANDI:
        return ArithmeticLogicUnit_1.default.AND;
    }

    switch (func7 + func3) {
      case InstructionHelper_1.default.FUNCT_SLLI:
        return ArithmeticLogicUnit_1.default.SLL;

      case InstructionHelper_1.default.FUNCT_SRLI:
        return ArithmeticLogicUnit_1.default.SRL;

      case InstructionHelper_1.default.FUNCT_SRAI:
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
  ALUControl.FUNC = Val_1.default.UnsignedInt(0, 2);
  ALUControl.OP = Val_1.default.UnsignedInt(1, 2);
  ALUControl.ADD = Val_1.default.UnsignedInt(2, 2);
  return ALUControl;
}(Component_1.default);

exports.default = ALUControl;
},{"./Component":"Component.ts","./Config":"Config.ts","./Val":"Val.ts","./ArithmeticLogicUnit":"ArithmeticLogicUnit.ts","./InstructionHelper":"InstructionHelper.ts"}],"DataMemory.ts":[function(require,module,exports) {
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

var Config_1 = __importDefault(require("./Config"));

var Component_1 = __importDefault(require("./Component"));

var Val_1 = __importStar(require("./Val"));

var DataMemory =
/** @class */
function (_super) {
  __extends(DataMemory, _super);

  function DataMemory(x, y) {
    var _this = _super.call(this, x, y) || this;

    _this.size = 32;
    _this.values = [];

    for (var i = 0; i < _this.size; i++) {
      _this.values.push(Val_1.VAL_ZERO_32b);
    }

    return _this;
  }

  DataMemory.prototype.draw = function (g) {
    g.fillRect(this.x, this.y, 100, this.size * 15 + 20, Config_1.default.elementFillColor, Config_1.default.elementStrokeColor);

    for (var i = 0; i < this.size; i++) {
      g.fillRect(this.x + 10, this.y + 10 + i * 15, 80, 15, Config_1.default.memoryFillColor, Config_1.default.memoryStrokeColor);
      g.drawText(this.x + 10 + 5, this.y + 10 + 12 + i * 15, this.values[i].asHexString(), Config_1.default.fontColor, 12);
    }
  };

  DataMemory.prototype.forwardSignal = function (signaler, value) {
    this._outputDataNode.forwardSignal(this, this.values[value.asUnsignedInt() / 4]);
  };

  Object.defineProperty(DataMemory.prototype, "writeEnNode", {
    set: function set(value) {
      this._writeEnNode = value;
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
    set: function set(value) {
      this._inputDataNode = value;
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
  DataMemory.WRITE_NO = Val_1.default.UnsignedInt(0, 1);
  DataMemory.WRITE_YES = Val_1.default.UnsignedInt(1, 1);
  return DataMemory;
}(Component_1.default);

exports.default = DataMemory;
},{"./Config":"Config.ts","./Component":"Component.ts","./Val":"Val.ts"}],"RegisterFile.ts":[function(require,module,exports) {
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

var Config_1 = __importDefault(require("./Config"));

var Val_1 = __importStar(require("./Val"));

var InstructionHelper_1 = __importDefault(require("./InstructionHelper"));

var RegisterFile =
/** @class */
function (_super) {
  __extends(RegisterFile, _super);

  function RegisterFile(x, y) {
    var _this = _super.call(this, x, y) || this;

    _this.size = 16;
    _this.values = [];

    for (var i = 0; i < _this.size; i++) {
      _this.values.push(Val_1.VAL_ZERO_32b);
    }

    _this.nextValue = undefined;
    _this.nextSel = undefined;
    return _this;
  }

  RegisterFile.prototype.draw = function (g) {
    g.fillRect(this.x, this.y, 100, this.size * 15 + 20, Config_1.default.elementFillColor, Config_1.default.elementStrokeColor);

    for (var i = 0; i < this.size; i++) {
      g.fillRect(this.x + 10, this.y + 10 + i * 15, 80, 15, Config_1.default.memoryFillColor, Config_1.default.memoryStrokeColor);
      g.drawText(this.x + 10 + 5, this.y + 10 + 12 + i * 15, this.values[i].asHexString(), Config_1.default.fontColor, 12);
    }
  };

  RegisterFile.prototype.refresh = function () {
    if (this.nextSel && this.nextValue) {
      this.values[this.nextSel] = this.nextValue;
    }

    this.nextValue = undefined;
    this.nextSel = undefined;
  };

  RegisterFile.prototype.forwardSignal = function (signaler, value) {
    if (signaler == this._readSel1Node) {
      this._readData1Node.forwardSignal(this, this.values[InstructionHelper_1.default.getRs1(value)]);
    } else if (signaler == this._readSel2Node) {
      this._readData2Node.forwardSignal(this, this.values[InstructionHelper_1.default.getRs2(value)]);
    } else {
      console.error("Error");
    }
  };

  RegisterFile.prototype.onRisingEdge = function () {
    if (this._inputWriteEnNode.value == RegisterFile.WRITE_YES) {
      this.nextSel = InstructionHelper_1.default.getRd(this._inputWriteSelNode.value);

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
          this._readSel1Node.mark(this);

          break;
        }

      case this._readData2Node:
        {
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
  RegisterFile.WRITE_NO = Val_1.default.UnsignedInt(0, 1);
  RegisterFile.WRITE_YES = Val_1.default.UnsignedInt(1, 1);
  return RegisterFile;
}(Component_1.default);

exports.default = RegisterFile;
},{"./Component":"Component.ts","./Config":"Config.ts","./Val":"Val.ts","./InstructionHelper":"InstructionHelper.ts"}],"ImmSelect.ts":[function(require,module,exports) {
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

var Config_1 = __importDefault(require("./Config"));

var Val_1 = __importDefault(require("./Val"));

var InstructionHelper_1 = __importDefault(require("./InstructionHelper"));

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
          result = InstructionHelper_1.default.getImmIType(this.instrValue);
          break;
        }

      case ImmSelect.BRTYPE:
        {
          result = InstructionHelper_1.default.getImmBType(this.instrValue);
          break;
        }

      case ImmSelect.BSTYPE:
        {
          result = InstructionHelper_1.default.getImmSType(this.instrValue);
          break;
        }

      default:
        {
          result = 0;
          console.log("Unsupported control signal");
        }
    }

    this._outNode.forwardSignal(this, new Val_1.default(result, 32));
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
  ImmSelect.ITYPE = Val_1.default.UnsignedInt(0, 2);
  ImmSelect.BRTYPE = Val_1.default.UnsignedInt(1, 2);
  ImmSelect.BSTYPE = Val_1.default.UnsignedInt(2, 2);
  return ImmSelect;
}(Component_1.default);

exports.default = ImmSelect;
},{"./Component":"Component.ts","./Config":"Config.ts","./Val":"Val.ts","./InstructionHelper":"InstructionHelper.ts"}],"ControlUnit.ts":[function(require,module,exports) {
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

var Config_1 = __importDefault(require("./Config"));

var Val_1 = require("./Val");

var ALUControl_1 = __importDefault(require("./ALUControl"));

var DataMemory_1 = __importDefault(require("./DataMemory"));

var RegisterFile_1 = __importDefault(require("./RegisterFile"));

var InstructionHelper_1 = __importDefault(require("./InstructionHelper"));

var ImmSelect_1 = __importDefault(require("./ImmSelect"));

var ControlUnit =
/** @class */
function (_super) {
  __extends(ControlUnit, _super);

  function ControlUnit(x, y) {
    var _this = _super.call(this, x, y) || this;

    _this.instrValue = Val_1.VAL_ZERO_32b;

    _this.refresh();

    return _this;
  }

  ControlUnit.prototype.draw = function (g) {
    g.fillRect(this.x, this.y, 250, 125, Config_1.default.elementFillColor, Config_1.default.elementStrokeColor);
    g.drawTextCentered(this.x, this.y + 45, 250, "Control", Config_1.default.fontColor, Config_1.default.fontSize);
    g.drawTextCentered(this.x, this.y + 70, 250, "Unit", Config_1.default.fontColor, Config_1.default.fontSize);
    g.fillRect(this.x + 10, this.y + 90, 230, 25, Config_1.default.memoryFillColor, Config_1.default.memoryStrokeColor);
    g.drawText(this.x + 20, this.y + 90 + 21, InstructionHelper_1.default.decode(this.instrValue), Config_1.default.fontColor, Config_1.default.fontSize);
  };

  ControlUnit.prototype.refresh = function () {
    this.instrValue = undefined;
  };

  ControlUnit.prototype.forwardSignal = function (signaler, value) {
    switch (signaler) {
      case this._instrNode:
        {
          this.instrValue = value;
          break;
        }

      default:
        {
          console.error("Error");
        }
    }

    var opcode = InstructionHelper_1.default.getOpCodeStr(this.instrValue);
    var ImmSel, Op2Sel, FuncSel, MemWr, RFWen, WBSel, WASel, PCSel;

    switch (opcode) {
      case InstructionHelper_1.default.OP_CODE_ALU:
        {
          ImmSel = undefined;
          Op2Sel = Val_1.VAL_ZERO_32b;
          FuncSel = ALUControl_1.default.FUNC;
          MemWr = DataMemory_1.default.WRITE_NO;
          RFWen = RegisterFile_1.default.WRITE_YES;
          WBSel = Val_1.VAL_TWO_32b;
          WASel = Val_1.VAL_ONE_32b;
          PCSel = Val_1.VAL_THREE_32b;
          break;
        }

      case InstructionHelper_1.default.OP_CODE_ALUI:
        {
          ImmSel = ImmSelect_1.default.ITYPE;
          Op2Sel = Val_1.VAL_ONE_32b;
          FuncSel = ALUControl_1.default.OP;
          MemWr = DataMemory_1.default.WRITE_NO;
          RFWen = RegisterFile_1.default.WRITE_YES;
          WBSel = Val_1.VAL_TWO_32b;
          WASel = Val_1.VAL_ONE_32b;
          PCSel = Val_1.VAL_THREE_32b;
          break;
        }

      case InstructionHelper_1.default.OP_CODE_LW:
        {
          ImmSel = ImmSelect_1.default.ITYPE;
          Op2Sel = Val_1.VAL_ONE_32b;
          FuncSel = ALUControl_1.default.ADD;
          MemWr = DataMemory_1.default.WRITE_NO;
          RFWen = RegisterFile_1.default.WRITE_YES;
          WBSel = Val_1.VAL_ONE_32b;
          WASel = Val_1.VAL_ONE_32b;
          PCSel = Val_1.VAL_THREE_32b;
          break;
        }

      case InstructionHelper_1.default.OP_CODE_SW:
        {
          ImmSel = ImmSelect_1.default.BSTYPE;
          Op2Sel = Val_1.VAL_ONE_32b;
          FuncSel = ALUControl_1.default.ADD;
          MemWr = DataMemory_1.default.WRITE_YES;
          RFWen = RegisterFile_1.default.WRITE_NO;
          WBSel = undefined;
          WASel = undefined;
          PCSel = Val_1.VAL_THREE_32b;
          break;
        }

      case InstructionHelper_1.default.OP_CODE_BRANCH:
        {
          ImmSel = ImmSelect_1.default.BRTYPE;
          Op2Sel = undefined;
          FuncSel = undefined;
          MemWr = DataMemory_1.default.WRITE_NO;
          RFWen = RegisterFile_1.default.WRITE_NO;
          WBSel = undefined;
          WASel = undefined;
          PCSel = true ? Val_1.VAL_ZERO_32b : Val_1.VAL_THREE_32b; // TODO

          break;
        }

      case InstructionHelper_1.default.OP_CODE_JAL:
        {
          ImmSel = undefined;
          Op2Sel = undefined;
          FuncSel = undefined;
          MemWr = DataMemory_1.default.WRITE_NO;
          RFWen = RegisterFile_1.default.WRITE_YES;
          WBSel = Val_1.VAL_ZERO_32b;
          WASel = Val_1.VAL_ZERO_32b;
          PCSel = Val_1.VAL_TWO_32b;
          break;
        }

      case InstructionHelper_1.default.OP_CODE_JALR:
        {
          ImmSel = undefined;
          Op2Sel = undefined;
          FuncSel = undefined;
          MemWr = DataMemory_1.default.WRITE_NO;
          RFWen = RegisterFile_1.default.WRITE_YES;
          WBSel = Val_1.VAL_ZERO_32b;
          WASel = Val_1.VAL_ONE_32b;
          PCSel = Val_1.VAL_ONE_32b;
          break;
        }

      default:
        {
          console.error("Unknown OP Code: " + opcode);
          PCSel = Val_1.VAL_THREE_32b;
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
  };

  Object.defineProperty(ControlUnit.prototype, "instrNode", {
    set: function set(node) {
      this._instrNode = node;
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
},{"./Component":"Component.ts","./Config":"Config.ts","./Val":"Val.ts","./ALUControl":"ALUControl.ts","./DataMemory":"DataMemory.ts","./RegisterFile":"RegisterFile.ts","./InstructionHelper":"InstructionHelper.ts","./ImmSelect":"ImmSelect.ts"}],"ConstValue.ts":[function(require,module,exports) {
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

var Graphics_1 = __importDefault(require("./Graphics"));

var Config_1 = __importDefault(require("./Config"));

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
},{"./Component":"Component.ts","./Graphics":"Graphics.ts","./Config":"Config.ts"}],"Simulator.ts":[function(require,module,exports) {
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

var Graphics_1 = __importDefault(require("./Graphics"));

var ArithmeticLogicUnit_1 = __importDefault(require("./ArithmeticLogicUnit"));

var Register_1 = __importDefault(require("./Register"));

var CircutNode_1 = __importDefault(require("./CircutNode"));

var Config_1 = __importDefault(require("./Config"));

var InstructionMemory_1 = __importDefault(require("./InstructionMemory"));

var Multiplexer_1 = __importStar(require("./Multiplexer"));

var ControlUnit_1 = __importDefault(require("./ControlUnit"));

var ConstValue_1 = __importDefault(require("./ConstValue"));

var RegisterFile_1 = __importDefault(require("./RegisterFile"));

var ImmSelect_1 = __importDefault(require("./ImmSelect"));

var ALUControl_1 = __importDefault(require("./ALUControl"));

var DataMemory_1 = __importDefault(require("./DataMemory"));

var Val_1 = __importDefault(require("./Val"));

var Simulator =
/** @class */
function () {
  function Simulator(canvas, parsed) {
    this.elements = [];
    this.g = new Graphics_1.default(canvas, 1200, 800);
    this.load(parsed);
  }

  Simulator.prototype.create = function () {
    var PCRegister = new Register_1.default(35, 230);
    var instrMemory = new InstructionMemory_1.default(60, 285, this.initialInstruct);
    var PCStep = new ConstValue_1.default(150, 135, Val_1.default.UnsignedInt(4));
    var PCAdder = new ArithmeticLogicUnit_1.default(205, 135, ArithmeticLogicUnit_1.default.ADD);
    var PCSelMux = new Multiplexer_1.default(210, 25, 4, Multiplexer_1.MultiplexerOrientation.LEFT);
    var controlUnit = new ControlUnit_1.default(170, 450);
    this.elements.push(PCRegister, instrMemory, PCStep, PCSelMux, PCAdder, controlUnit);
    var WASel1 = new ConstValue_1.default(450, 520, Val_1.default.UnsignedInt(1));
    var WASelMux = new Multiplexer_1.default(485, 520, 2);
    var registerFile = new RegisterFile_1.default(550, 350);
    var immSelect = new ImmSelect_1.default(670, 550);
    var ALUCtrl = new ALUControl_1.default(740, 630);
    this.elements.push(WASel1, registerFile, WASelMux, immSelect, ALUCtrl);
    var op2SelMux = new Multiplexer_1.default(850, 500, 2);
    var ALU = new ArithmeticLogicUnit_1.default(895, 400);
    this.elements.push(op2SelMux, ALU);
    var dataMemory = new DataMemory_1.default(985, 200);
    var WBSelMux = new Multiplexer_1.default(1135, 600, 3);
    this.elements.push(dataMemory, WBSelMux);
    /* PC enable write */

    var node = new CircutNode_1.default(65, 230, Val_1.default.UnsignedInt(1));
    PCRegister.writeEnable = node;
    this.elements.push(node); // Not required

    var path;
    /* PCSelMux ->  PC */

    path = this.createPath([[210, 72.5], [25, 72.5], [25, 242.5], [35, 242.5]]);
    PCSelMux.outNode = path[0];
    PCRegister.inputNode = path[path.length - 1];
    /* PC Step -> PC Adder */

    path = this.createPath([[175, 147.5], [205, 147.5]]);
    PCStep.outNode = path[0];
    PCAdder.input1Node = path[path.length - 1];
    /* PC Register -> PC Adder */

    path = this.createPath([[185, 242.5], [195, 242.5], [195, 197.5], [205, 197.5]]);
    PCRegister.outNode = path[0];
    PCAdder.input2Node = path[path.length - 1];
    var PCRegisterNode = path[1];
    /* PC Adder -> PCSelMux */

    path = this.createPath([[245, 172.5], [255, 172.5], [255, 95], [235, 95]]);
    PCAdder.resultNode = path[0];
    PCSelMux.setInputNodes(3, path[path.length - 1]);
    /* PC Register -> Instruction memory */

    path = this.createPath([[195, 242.5], [195, 275], [110, 275], [110, 285]]);
    PCRegisterNode.addNeighbour(path[0]);
    instrMemory.addressNode = path[path.length - 1];
    /* Instruction memory -> instrNode */

    path = this.createPath([[160, 412.5], [295, 412.5]]);
    instrMemory.outputDataNode = path[0];
    var instrNode = path[path.length - 1];
    /* instrNode -> Control unit */

    path = this.createPath([[295, 412.5], [295, 450]]);
    instrNode.addNeighbour(path[0]);
    controlUnit.instrNode = path[path.length - 1];
    /* Extend instruction wire */

    node = new CircutNode_1.default(430, 412.5);
    this.elements.push(node);
    instrNode.addNeighbour(node);
    instrNode = node;
    /* WASel1 -> WASelMux */

    path = this.createPath([[475, 532.5], [485, 532.5]]);
    WASel1.outNode = path[1];
    WASelMux.setInputNodes(0, path[path.length - 1]);
    /* WASelMux -> Register File */

    path = this.createPath([[510, 552.5], [550, 552.5]]);
    WASelMux.outNode = path[0];
    registerFile.inputWriteSelNode = path[path.length - 1];
    /* instrNode -> RF Write select */

    path = this.createPath([[430, 570], [485, 570]]);
    instrNode.addNeighbour(path[0]);
    var instrNodeBottom = path[0];
    WASelMux.setInputNodes(1, path[path.length - 1]);
    /* instrNode -> ImmSelect */

    path = this.createPath([[430, 620], [660, 620], [660, 575], [670, 575]]);
    instrNodeBottom.addNeighbour(path[0]);
    instrNodeBottom = path[0];
    immSelect.instrNode = path[path.length - 1];
    /* instrNode -> ALU Control */

    path = this.createPath([[430, 655], [740, 655]]);
    instrNodeBottom.addNeighbour(path[0]);
    instrNodeBottom = path[0];
    ALUCtrl.instrNode = path[path.length - 1];
    /* instrNode -> ReadSel2 */

    path = this.createPath([[430, 390], [550, 390]]);
    instrNode.addNeighbour(path[0]);
    var instrNodeTop = path[0];
    registerFile.readSel2Node = path[path.length - 1];
    /* instrNode -> ReadSel1 */

    path = this.createPath([[430, 370], [550, 370]]);
    instrNodeTop.addNeighbour(path[0]);
    instrNodeTop = path[0];
    registerFile.readSel1Node = path[path.length - 1];
    /* ImmSelect -> op2SelMux */

    path = this.createPath([[770, 575], [790, 575], [790, 550], [850, 550]]);
    immSelect.outNode = path[0];
    op2SelMux.setInputNodes(1, path[path.length - 1]);
    /* RF ReadData2 -> op2SelMux */

    path = this.createPath([[650, 390], [670, 390], [670, 525], [830, 525], [850, 525]]);
    registerFile.readData2Node = path[0];
    op2SelMux.setInputNodes(0, path[path.length - 1]);
    var readData2Node = path[path.length - 2];
    /* RF ReadData1 -> ALU */

    path = this.createPath([[650, 370], [885, 370], [885, 415], [895, 415]]);
    registerFile.readData1Node = path[0];
    ALU.input1Node = path[path.length - 1];
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
    WBSelMux.setInputNodes(2, path[path.length - 1]);
    /* WBSel Mux -> RF WriteData */

    path = this.createPath([[1160, 640], [1180, 640], [1180, 730], [530, 730], [530, 590], [550, 590]]);
    WBSelMux.outNode = path[0];
    registerFile.inputWriteDataNode = path[path.length - 1];
    /* RF ReadData2 -> DataMemory */

    path = this.createPath([[830, 610], [985, 610]]);
    readData2Node.addNeighbour(path[0]);
    dataMemory.inputDataNode = path[path.length - 1];
    /*
     *Control signals
     */

    /* PCSel */

    path = this.createPath([[222.5, 10], [222.5, 32.5]]);
    controlUnit.PCSelNode = path[0];
    PCSelMux.selInputNode = path[path.length - 1];
    /* RegEnWrite */

    path = this.createPath([[575, 10], [575, 350]]);
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

    path = this.createPath([[497.5, 790], [497.5, 577.5]]);
    controlUnit.WASel = path[0];
    WASelMux.selInputNode = path[path.length - 1];
    /* ImmSel */

    path = this.createPath([[720, 790], [720, 600]]);
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
    this.g.clear(Config_1.default.backgroundColor);
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
    this.create();
    this.step();
  };

  return Simulator;
}();

exports.default = Simulator;
},{"./Graphics":"Graphics.ts","./ArithmeticLogicUnit":"ArithmeticLogicUnit.ts","./Register":"Register.ts","./CircutNode":"CircutNode.ts","./Config":"Config.ts","./InstructionMemory":"InstructionMemory.ts","./Multiplexer":"Multiplexer.ts","./ControlUnit":"ControlUnit.ts","./ConstValue":"ConstValue.ts","./RegisterFile":"RegisterFile.ts","./ImmSelect":"ImmSelect.ts","./ALUControl":"ALUControl.ts","./DataMemory":"DataMemory.ts","./Val":"Val.ts"}],"Parser.ts":[function(require,module,exports) {
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

var Val_1 = __importStar(require("././Val"));

var InstructionMemory_1 = __importDefault(require("./InstructionMemory"));

var Parser =
/** @class */
function () {
  function Parser() {}

  Parser.parse = function (textContent) {
    var ret = [];
    var lines = textContent.split('\n');

    for (var i = 0; i < lines.length; i++) {
      ret.push(Val_1.default.HexString(lines[i]));
    }

    while (ret.length < InstructionMemory_1.default.SIZE) {
      ret.push(Val_1.VAL_ZERO_32b);
    }

    return ret;
  };

  return Parser;
}();

exports.default = Parser;
},{"././Val":"Val.ts","./InstructionMemory":"InstructionMemory.ts"}],"util.ts":[function(require,module,exports) {
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
      documentBody.requestFullScreen();
    } else if (documentBody.webkitRequestFullscreen) {
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
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
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

var Parser_1 = __importDefault(require("./Parser"));

var util_1 = require("./util");

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
}, 1000);
},{"./Simulator":"Simulator.ts","./Parser":"Parser.ts","./util":"util.ts"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "55123" + '/');

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