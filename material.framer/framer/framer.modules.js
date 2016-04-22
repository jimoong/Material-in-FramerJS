require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"material":[function(require,module,exports){
var Line, S,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

S = function(n) {
  var device, scale;
  scale = 1;
  device = Framer.Device.deviceType;
  if (device.slice(0, "apple-iphone".length) === "apple-iphone") {
    scale = Screen.width / 375;
  } else if (device.slice(0, "google-nexus".length) === "google-nexus") {
    scale = Screen.width / 360;
  }
  return n * scale;
};

Line = (function(superClass) {
  extend(Line, superClass);

  function Line(size, thickness, color) {
    Line.__super__.constructor.call(this, {
      width: size,
      height: size,
      backgroundColor: null
    });
    this.leftHalfWrapper = new Layer({
      backgroundColor: null,
      width: this.width / 2,
      height: this.width,
      parent: this,
      clip: true,
      force2d: true
    });
    this.leftHalfClip = new Layer({
      backgroundColor: null,
      x: this.width / 2,
      width: this.width / 2,
      height: this.width,
      originX: 0,
      originY: 0.5,
      parent: this.leftHalfWrapper,
      clip: true,
      force2d: true
    });
    this.leftHalf = new Layer({
      backgroundColor: null,
      x: -this.width / 2,
      width: this.width,
      height: this.width,
      borderRadius: this.width / 2,
      borderWidth: thickness,
      borderColor: color,
      parent: this.leftHalfClip,
      force2d: true
    });
    this.rightHalfWrapper = new Layer({
      backgroundColor: null,
      x: this.width / 2,
      width: this.width / 2,
      height: this.width,
      parent: this,
      clip: true,
      force2d: true
    });
    this.rightHalfClip = new Layer({
      backgroundColor: null,
      x: -this.width / 2,
      width: this.width / 2,
      height: this.width,
      originX: 1,
      originY: 0.5,
      parent: this.rightHalfWrapper,
      clip: true,
      force2d: true
    });
    this.rightHalf = new Layer({
      backgroundColor: null,
      width: this.width,
      height: this.width,
      borderRadius: this.width / 2,
      borderWidth: thickness,
      borderColor: color,
      parent: this.rightHalfClip,
      force2d: true
    });
  }

  Line.prototype._v = 0;

  Line.define("value", {
    get: function() {
      return this._v;
    },
    set: function(v) {
      this._v = v;
      if (v < 0.5) {
        this.rightHalfClip.rotationZ = 360 * v;
        return this.leftHalfClip.rotationZ = 0;
      } else {
        this.rightHalfClip.rotationZ = 180;
        return this.leftHalfClip.rotationZ = 360 * v - 180;
      }
    }
  });

  return Line;

})(Layer);

exports.Spinner = (function(superClass) {
  extend(Spinner, superClass);

  Spinner.prototype.colors = ["#DB4437", "#4285F4", "#0F9D58", "#F4B400"];

  function Spinner(options) {
    this.options = options != null ? options : {};
    if (!this.options.size) {
      this.options.size = 48;
    }
    if (!this.options.thickness) {
      this.options.thickness = 4;
    }
    if (!this.options.color) {
      this.options.color = "#4285f4";
    }
    if (typeof this.options.changeColor === "undefined") {
      this.options.changeColor = true;
    }
    Spinner.__super__.constructor.call(this, {
      width: S(this.options.size),
      height: S(this.options.size),
      backgroundColor: null
    });
    this.line = new Line(S(this.options.size), S(this.options.thickness), this.options.color);
    this.line.parent = this;
  }

  Spinner.prototype._started = false;

  Spinner.prototype.start = function() {
    this.rotation = this.line.value = 0;
    this.opacity = 1;
    this._started = true;
    return this._animate();
  };

  Spinner.prototype.stop = function() {
    this._started = false;
    return this.animate({
      properties: {
        opacity: 0
      },
      time: 0.2
    });
  };

  Spinner.prototype._counter = 0;

  Spinner.prototype._animate = function() {
    var lineIn, lineOut, rotate;
    rotate = new Animation({
      layer: this,
      properties: {
        rotation: 360
      },
      time: 1.9,
      curve: "linear"
    });
    lineIn = new Animation({
      layer: this.line,
      properties: {
        value: 0.75
      },
      time: 0.64,
      curve: "cubic-bezier(0.4, 0.0, 0.2, 1)"
    });
    lineOut = new Animation({
      layer: this.line,
      properties: {
        value: 0.03,
        rotation: 360
      },
      time: 0.78,
      curve: "cubic-bezier(0.4, 0.0, 0.2, 1)"
    });
    rotate.on(Events.AnimationEnd, (function(_this) {
      return function() {
        _this.rotation = 0;
        if (_this._started) {
          return rotate.start();
        }
      };
    })(this));
    lineIn.on(Events.AnimationEnd, (function(_this) {
      return function() {
        if (_this._started) {
          return lineOut.start();
        }
      };
    })(this));
    lineOut.on(Events.AnimationEnd, (function(_this) {
      return function() {
        _this.line.rotation = 0;
        if (_this._started) {
          lineIn.start();
        }
        if (_this.options.changeColor) {
          _this.line.leftHalf.animate({
            properties: {
              borderColor: _this.colors[_this._counter]
            },
            time: 0.2,
            colorModel: "rgb"
          });
          _this.line.rightHalf.animate({
            properties: {
              borderColor: _this.colors[_this._counter]
            },
            time: 0.2,
            colorModel: "rgb"
          });
          _this._counter++;
          if (_this._counter >= _this.colors.length) {
            return _this._counter = 0;
          }
        }
      };
    })(this));
    rotate.start();
    return lineIn.start();
  };

  return Spinner;

})(Layer);


},{}],"myModule":[function(require,module,exports){
exports.myVar = "myVariable";

exports.myFunction = function() {
  return print("myFunction is running");
};

exports.myArray = [1, 2, 3];


},{}]},{},[])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvaml3b29uZy9Hb29nbGUgRHJpdmUgKGppd29vbmdAZ29vZ2xlLmNvbSkvQ29kaW5nL1Nob3cgUHJvamVjdHMvbWF0ZXJpYWwuZnJhbWVyL21vZHVsZXMvbWF0ZXJpYWwuY29mZmVlIiwiL1VzZXJzL2ppd29vbmcvR29vZ2xlIERyaXZlIChqaXdvb25nQGdvb2dsZS5jb20pL0NvZGluZy9TaG93IFByb2plY3RzL21hdGVyaWFsLmZyYW1lci9tb2R1bGVzL215TW9kdWxlLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUEsT0FBQTtFQUFBOzs7QUFBQSxDQUFBLEdBQUksU0FBQyxDQUFEO0FBQ0gsTUFBQTtFQUFBLEtBQUEsR0FBUTtFQUNSLE1BQUEsR0FBUyxNQUFNLENBQUMsTUFBTSxDQUFDO0VBQ3ZCLElBQUcsTUFBTSxDQUFDLEtBQVAsQ0FBYSxDQUFiLEVBQWdCLGNBQWMsQ0FBQyxNQUEvQixDQUFBLEtBQTBDLGNBQTdDO0lBQ0MsS0FBQSxHQUFRLE1BQU0sQ0FBQyxLQUFQLEdBQWUsSUFEeEI7R0FBQSxNQUVLLElBQUcsTUFBTSxDQUFDLEtBQVAsQ0FBYSxDQUFiLEVBQWdCLGNBQWMsQ0FBQyxNQUEvQixDQUFBLEtBQTBDLGNBQTdDO0lBQ0osS0FBQSxHQUFRLE1BQU0sQ0FBQyxLQUFQLEdBQWUsSUFEbkI7O0FBRUwsU0FBTyxDQUFBLEdBQUk7QUFQUjs7QUFTRTs7O0VBQ1EsY0FBQyxJQUFELEVBQU8sU0FBUCxFQUFrQixLQUFsQjtJQUNaLHNDQUFNO01BQUEsS0FBQSxFQUFPLElBQVA7TUFBYSxNQUFBLEVBQVEsSUFBckI7TUFBMkIsZUFBQSxFQUFpQixJQUE1QztLQUFOO0lBR0EsSUFBQyxDQUFBLGVBQUQsR0FBdUIsSUFBQSxLQUFBLENBQ3RCO01BQUEsZUFBQSxFQUFpQixJQUFqQjtN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QUFBLFFBQUQ7VUFDQSxJQUFpQixLQUFDLENBQUEsUUFBRCxJQUFhLEtBQUMsQ0FBQSxNQUFNLENBQUMsTUFBdEM7bUJBQUEsS0FBQyxDQUFBLFFBQUQsR0FBWSxFQUFaO1dBVkQ7O01BSitCO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFoQztJQWdCQSxNQUFNLENBQUMsS0FBUCxDQUFBO1dBQ0EsTUFBTSxDQUFDLEtBQVAsQ0FBQTtFQXpDUzs7OztHQXpCbUI7Ozs7QUN2RTlCLE9BQU8sQ0FBQyxLQUFSLEdBQWdCOztBQUVoQixPQUFPLENBQUMsVUFBUixHQUFxQixTQUFBO1NBQ3BCLEtBQUEsQ0FBTSx1QkFBTjtBQURvQjs7QUFHckIsT0FBTyxDQUFDLE9BQVIsR0FBa0IsQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiUyA9IChuKSAtPlxuXHRzY2FsZSA9IDFcblx0ZGV2aWNlID0gRnJhbWVyLkRldmljZS5kZXZpY2VUeXBlXG5cdGlmIGRldmljZS5zbGljZSgwLCBcImFwcGxlLWlwaG9uZVwiLmxlbmd0aCkgaXMgXCJhcHBsZS1pcGhvbmVcIlxuXHRcdHNjYWxlID0gU2NyZWVuLndpZHRoIC8gMzc1XG5cdGVsc2UgaWYgZGV2aWNlLnNsaWNlKDAsIFwiZ29vZ2xlLW5leHVzXCIubGVuZ3RoKSBpcyBcImdvb2dsZS1uZXh1c1wiXG5cdFx0c2NhbGUgPSBTY3JlZW4ud2lkdGggLyAzNjBcblx0cmV0dXJuIG4gKiBzY2FsZVxuXG5jbGFzcyBMaW5lIGV4dGVuZHMgTGF5ZXJcblx0Y29uc3RydWN0b3I6IChzaXplLCB0aGlja25lc3MsIGNvbG9yKS0+XG5cdFx0c3VwZXIgd2lkdGg6IHNpemUsIGhlaWdodDogc2l6ZSwgYmFja2dyb3VuZENvbG9yOiBudWxsXG5cblx0XHQjIExlZnQgaGFsZlxuXHRcdEBsZWZ0SGFsZldyYXBwZXIgPSBuZXcgTGF5ZXJcblx0XHRcdGJhY2tncm91bmRDb2xvcjogbnVsbFxuXHRcdFx0d2lkdGg6IEB3aWR0aCAvIDIsIGhlaWdodDogQHdpZHRoXG5cdFx0XHRwYXJlbnQ6IEBcblx0XHRcdGNsaXA6IHllc1xuXHRcdFx0Zm9yY2UyZDogeWVzXG5cdFx0QGxlZnRIYWxmQ2xpcCA9IG5ldyBMYXllclxuXHRcdFx0YmFja2dyb3VuZENvbG9yOiBudWxsXG5cdFx0XHR4OiBAd2lkdGggLyAyXG5cdFx0XHR3aWR0aDogQHdpZHRoIC8gMiwgaGVpZ2h0OiBAd2lkdGhcblx0XHRcdG9yaWdpblg6IDAsIG9yaWdpblk6IDAuNVxuXHRcdFx0cGFyZW50OiBAbGVmdEhhbGZXcmFwcGVyXG5cdFx0XHRjbGlwOiB5ZXNcblx0XHRcdGZvcmNlMmQ6IHllc1xuXHRcdEBsZWZ0SGFsZiA9IG5ldyBMYXllclxuXHRcdFx0YmFja2dyb3VuZENvbG9yOiBudWxsXG5cdFx0XHR4OiAtQHdpZHRoIC8gMlxuXHRcdFx0d2lkdGg6IEB3aWR0aCwgaGVpZ2h0OiBAd2lkdGhcblx0XHRcdGJvcmRlclJhZGl1czogQHdpZHRoIC8gMlxuXHRcdFx0Ym9yZGVyV2lkdGg6IHRoaWNrbmVzc1xuXHRcdFx0Ym9yZGVyQ29sb3I6IGNvbG9yXG5cdFx0XHRwYXJlbnQ6IEBsZWZ0SGFsZkNsaXBcblx0XHRcdGZvcmNlMmQ6IHllc1xuXHRcdFx0XG5cdFx0IyBSaWdodCBoYWxmXG5cdFx0QHJpZ2h0SGFsZldyYXBwZXIgPSBuZXcgTGF5ZXJcblx0XHRcdGJhY2tncm91bmRDb2xvcjogbnVsbFxuXHRcdFx0eDogQHdpZHRoIC8gMlxuXHRcdFx0d2lkdGg6IEB3aWR0aCAvIDIsIGhlaWdodDogQHdpZHRoXG5cdFx0XHRwYXJlbnQ6IEBcblx0XHRcdGNsaXA6IHllc1xuXHRcdFx0Zm9yY2UyZDogeWVzXG5cdFx0QHJpZ2h0SGFsZkNsaXAgPSBuZXcgTGF5ZXJcblx0XHRcdGJhY2tncm91bmRDb2xvcjogbnVsbFxuXHRcdFx0eDogLUB3aWR0aCAvIDJcblx0XHRcdHdpZHRoOiBAd2lkdGggLyAyLCBoZWlnaHQ6IEB3aWR0aFxuXHRcdFx0b3JpZ2luWDogMSwgb3JpZ2luWTogMC41XG5cdFx0XHRwYXJlbnQ6IEByaWdodEhhbGZXcmFwcGVyXG5cdFx0XHRjbGlwOiB5ZXNcblx0XHRcdGZvcmNlMmQ6IHllc1xuXHRcdEByaWdodEhhbGYgPSBuZXcgTGF5ZXJcblx0XHRcdGJhY2tncm91bmRDb2xvcjogbnVsbFxuXHRcdFx0d2lkdGg6IEB3aWR0aCwgaGVpZ2h0OiBAd2lkdGhcblx0XHRcdGJvcmRlclJhZGl1czogQHdpZHRoIC8gMlxuXHRcdFx0Ym9yZGVyV2lkdGg6IHRoaWNrbmVzc1xuXHRcdFx0Ym9yZGVyQ29sb3I6IGNvbG9yXG5cdFx0XHRwYXJlbnQ6IEByaWdodEhhbGZDbGlwXG5cdFx0XHRmb3JjZTJkOiB5ZXNcblxuXHRfdjogMFx0IyBtaW46IDAsIG1heDogMVx0XG5cdEBkZWZpbmUgXCJ2YWx1ZVwiLFxuXHRcdGdldDogLT4gQF92XG5cdFx0c2V0OiAodikgLT5cblx0XHRcdEBfdiA9IHZcblx0XHRcdGlmIHYgPCAwLjVcblx0XHRcdFx0QHJpZ2h0SGFsZkNsaXAucm90YXRpb25aID0gMzYwICogdlxuXHRcdFx0XHRAbGVmdEhhbGZDbGlwLnJvdGF0aW9uWiA9IDBcblx0XHRcdGVsc2Vcblx0XHRcdFx0QHJpZ2h0SGFsZkNsaXAucm90YXRpb25aID0gMTgwXG5cdFx0XHRcdEBsZWZ0SGFsZkNsaXAucm90YXRpb25aID0gMzYwICogdiAtIDE4MFxuXG5jbGFzcyBleHBvcnRzLlNwaW5uZXIgZXh0ZW5kcyBMYXllclxuXHRjb2xvcnM6IFtcIiNEQjQ0MzdcIiwgXCIjNDI4NUY0XCIsIFwiIzBGOUQ1OFwiLCBcIiNGNEI0MDBcIl0gIyBkZWZhdWx0XG5cdGNvbnN0cnVjdG9yOiAoQG9wdGlvbnM9e30pIC0+XG5cdFx0QG9wdGlvbnMuc2l6ZSA9IDQ4IHVubGVzcyBAb3B0aW9ucy5zaXplXG5cdFx0QG9wdGlvbnMudGhpY2tuZXNzID0gNCB1bmxlc3MgQG9wdGlvbnMudGhpY2tuZXNzXG5cdFx0QG9wdGlvbnMuY29sb3IgPSBcIiM0Mjg1ZjRcIiB1bmxlc3MgQG9wdGlvbnMuY29sb3Jcblx0XHRAb3B0aW9ucy5jaGFuZ2VDb2xvciA9IHllcyBpZiB0eXBlb2YgQG9wdGlvbnMuY2hhbmdlQ29sb3IgaXMgXCJ1bmRlZmluZWRcIlxuXHRcdFxuXHRcdHN1cGVyIHdpZHRoOiBTKEBvcHRpb25zLnNpemUpLCBoZWlnaHQ6IFMoQG9wdGlvbnMuc2l6ZSksIGJhY2tncm91bmRDb2xvcjogbnVsbFxuXHRcdEBsaW5lID0gbmV3IExpbmUgUyhAb3B0aW9ucy5zaXplKSwgUyhAb3B0aW9ucy50aGlja25lc3MpLCBAb3B0aW9ucy5jb2xvclxuXHRcdEBsaW5lLnBhcmVudCA9IEBcblxuXHRfc3RhcnRlZDogZmFsc2Vcblx0c3RhcnQ6IC0+XG5cdFx0QHJvdGF0aW9uID0gQGxpbmUudmFsdWUgPSAwXG5cdFx0QG9wYWNpdHkgPSAxXG5cdFx0QF9zdGFydGVkID0gdHJ1ZVxuXHRcdEBfYW5pbWF0ZSgpXG5cdHN0b3A6IC0+XG5cdFx0QF9zdGFydGVkID0gZmFsc2Vcblx0XHRAYW5pbWF0ZVxuXHRcdFx0cHJvcGVydGllczogb3BhY2l0eTogMFxuXHRcdFx0dGltZTogMC4yXG5cdFxuXHRfY291bnRlcjogMFxuXHRfYW5pbWF0ZTogLT5cblx0XHRyb3RhdGUgPSBuZXcgQW5pbWF0aW9uXG5cdFx0XHRsYXllcjogQFxuXHRcdFx0cHJvcGVydGllczogcm90YXRpb246IDM2MFxuXHRcdFx0dGltZTogMS45XG5cdFx0XHRjdXJ2ZTogXCJsaW5lYXJcIlxuXHRcdGxpbmVJbiA9IG5ldyBBbmltYXRpb25cblx0XHRcdGxheWVyOiBAbGluZVxuXHRcdFx0cHJvcGVydGllczogdmFsdWU6IDAuNzVcblx0XHRcdHRpbWU6IDAuNjRcblx0XHRcdGN1cnZlOiBcImN1YmljLWJlemllcigwLjQsIDAuMCwgMC4yLCAxKVwiXG5cdFx0bGluZU91dCA9IG5ldyBBbmltYXRpb25cblx0XHRcdGxheWVyOiBAbGluZVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0dmFsdWU6IDAuMDNcblx0XHRcdFx0cm90YXRpb246IDM2MFxuXHRcdFx0dGltZTogMC43OFxuXHRcdFx0Y3VydmU6IFwiY3ViaWMtYmV6aWVyKDAuNCwgMC4wLCAwLjIsIDEpXCJcblx0XHRcblx0XHRyb3RhdGUub24gRXZlbnRzLkFuaW1hdGlvbkVuZCwgPT5cblx0XHRcdEByb3RhdGlvbiA9IDBcblx0XHRcdHJvdGF0ZS5zdGFydCgpIGlmIEBfc3RhcnRlZFxuXHRcdGxpbmVJbi5vbiBFdmVudHMuQW5pbWF0aW9uRW5kLCA9PlxuXHRcdFx0bGluZU91dC5zdGFydCgpIGlmIEBfc3RhcnRlZFxuXHRcdGxpbmVPdXQub24gRXZlbnRzLkFuaW1hdGlvbkVuZCwgPT5cblx0XHRcdEBsaW5lLnJvdGF0aW9uID0gMFxuXHRcdFx0bGluZUluLnN0YXJ0KCkgaWYgQF9zdGFydGVkXG5cdFx0XHRcblx0XHRcdGlmIEBvcHRpb25zLmNoYW5nZUNvbG9yXG5cdFx0XHRcdEBsaW5lLmxlZnRIYWxmLmFuaW1hdGVcblx0XHRcdFx0XHRwcm9wZXJ0aWVzOiBib3JkZXJDb2xvcjogQGNvbG9yc1tAX2NvdW50ZXJdXG5cdFx0XHRcdFx0dGltZTogMC4yXG5cdFx0XHRcdFx0Y29sb3JNb2RlbDogXCJyZ2JcIlxuXHRcdFx0XHRAbGluZS5yaWdodEhhbGYuYW5pbWF0ZVxuXHRcdFx0XHRcdHByb3BlcnRpZXM6IGJvcmRlckNvbG9yOiBAY29sb3JzW0BfY291bnRlcl1cblx0XHRcdFx0XHR0aW1lOiAwLjJcblx0XHRcdFx0XHRjb2xvck1vZGVsOiBcInJnYlwiXG5cdFx0XHRcdEBfY291bnRlcisrXG5cdFx0XHRcdEBfY291bnRlciA9IDAgaWYgQF9jb3VudGVyID49IEBjb2xvcnMubGVuZ3RoXG5cdFx0XG5cdFx0cm90YXRlLnN0YXJ0KClcblx0XHRsaW5lSW4uc3RhcnQoKSIsIiMgQWRkIHRoZSBmb2xsb3dpbmcgbGluZSB0byB5b3VyIHByb2plY3QgaW4gRnJhbWVyIFN0dWRpby4gXG4jIG15TW9kdWxlID0gcmVxdWlyZSBcIm15TW9kdWxlXCJcbiMgUmVmZXJlbmNlIHRoZSBjb250ZW50cyBieSBuYW1lLCBsaWtlIG15TW9kdWxlLm15RnVuY3Rpb24oKSBvciBteU1vZHVsZS5teVZhclxuXG5leHBvcnRzLm15VmFyID0gXCJteVZhcmlhYmxlXCJcblxuZXhwb3J0cy5teUZ1bmN0aW9uID0gLT5cblx0cHJpbnQgXCJteUZ1bmN0aW9uIGlzIHJ1bm5pbmdcIlxuXG5leHBvcnRzLm15QXJyYXkgPSBbMSwgMiwgM10iXX0=
