(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bouncing_balls_app_class_1 = require("./classes/bouncing-balls-app.class");
var app = new bouncing_balls_app_class_1.BouncingBallsApp();
app.init();

},{"./classes/bouncing-balls-app.class":3}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ball_class_1 = require("../models/ball.class");
var vector_class_1 = require("../models/vector.class");
var trig_utils_class_1 = require("./trig-utils.class");
var BALL_SCALE = 100;
var GRAVITY_COEFFICIENT = 0.75;
var Animate = (function () {
    function Animate(boundingBox) {
        this.boundingBox = boundingBox;
        this.balls = [];
        this.width = boundingBox.clientWidth;
        this.height = boundingBox.clientHeight;
        this.halfWidth = this.width / 2;
        this.halfHeight = this.height / 2;
        this.leftLimit = -this.halfWidth;
        this.rightLimit = this.halfWidth;
        this.floor = -this.halfHeight;
        this.ceiling = this.halfHeight;
    }
    /**
     *  - Map click X,Y to cartesian
     *  - Generate a ball
     *  - Place into bounding box
     *  - Add to array of balls
     *
     * @param event - click event from the bounding box element
     */
    Animate.prototype.addBall = function (event) {
        var ball = new ball_class_1.Ball(), size = Math.random() * BALL_SCALE, radius = size / 2, velocity = new vector_class_1.Vector2D(trig_utils_class_1.TrigUtils.getRandom(true), trig_utils_class_1.TrigUtils.getRandom(false)), clientX = event.clientX - radius, clientY = event.clientY - radius;
        ball.elem = document.createElement('div');
        ball.elem.className = 'ball';
        ball.elem.style.position = 'absolute';
        ball.elem.style.width = size + 'px';
        ball.elem.style.height = size + 'px';
        ball.elem.style.left = clientX + 'px';
        ball.elem.style.top = clientY + 'px';
        ball.radius = radius;
        ball.velocity = velocity;
        ball.position = trig_utils_class_1.TrigUtils.mapDocumentToCartesian(new vector_class_1.Vector2D(event.clientX, event.clientY), this.halfWidth, this.halfHeight);
        this.balls.push(ball);
        this.boundingBox.appendChild(ball.elem);
        if (this.balls.length === 1) {
            this.animationTick();
        }
    };
    /**
     *  - On tick, apply direction vector to position vector across all balls
     *  - Add some gravity to drift elements down to the bottom
     *  - If ball hits floor, apply the bouncing CSS effect
     *  - Map cartesian x,y to document based x,y and apply to position of ball element
     */
    Animate.prototype.animationTick = function () {
        var _this = this;
        this.balls.forEach(function (ball) {
            var positionUpdate, documentPositionUpdate;
            ball.reachedFloor = trig_utils_class_1.TrigUtils.testFloor(ball.position, ball, _this.floor);
            if (ball.reachedFloor) {
                ball.velocity = new vector_class_1.Vector2D(0, 0);
                ball.elem.classList.add('bounce');
                return;
            }
            ball.velocity = trig_utils_class_1.TrigUtils.testSides(ball.position, ball, _this.leftLimit, _this.rightLimit);
            ball.velocity = trig_utils_class_1.TrigUtils.testCeiling(ball.position, ball, _this.ceiling);
            positionUpdate = trig_utils_class_1.TrigUtils.addVectors(ball.position, ball.velocity);
            positionUpdate.y -= GRAVITY_COEFFICIENT; // add gravity effect
            ball.position = positionUpdate;
            documentPositionUpdate = trig_utils_class_1.TrigUtils.mapCartesianToDocument(positionUpdate, _this.halfWidth, _this.halfHeight);
            ball.elem.style.left = documentPositionUpdate.x + 'px';
            ball.elem.style.top = documentPositionUpdate.y + 'px';
        });
        window.requestAnimationFrame(function () { return _this.animationTick(); });
    };
    return Animate;
}());
exports.Animate = Animate;

},{"../models/ball.class":5,"../models/vector.class":6,"./trig-utils.class":4}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var animate_class_1 = require("./animate.class");
var BouncingBallsApp = (function () {
    function BouncingBallsApp() {
    }
    BouncingBallsApp.prototype.init = function () {
        var boundingBox = document.querySelector('.bounding-box');
        var animate;
        boundingBox.style.height = window.innerHeight + 'px';
        animate = new animate_class_1.Animate(boundingBox);
        boundingBox.addEventListener('click', function (evt) { return animate.addBall(evt); });
    };
    return BouncingBallsApp;
}());
exports.BouncingBallsApp = BouncingBallsApp;

},{"./animate.class":2}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vector_class_1 = require("../models/vector.class");
var SPEED_SCALE = 10;
var RIGHT_ANGLE = 90;
var TrigUtils = (function () {
    function TrigUtils() {
    }
    /**
     * Given the clientX and clientY (as Vector2D), convert to Cartesian space vector
     * @param documentVector
     * @param halfWidth
     * @param halfHeight
     * @returns {Vector2D}
     */
    TrigUtils.mapDocumentToCartesian = function (documentVector, halfWidth, halfHeight) {
        return new vector_class_1.Vector2D(documentVector.x - halfWidth, -documentVector.y + halfHeight);
    };
    /**
     * Will convert Cartesian space to document (DOM) coordinates
     * @param v
     * @param halfWidth
     * @param halfHeight
     * @returns {{x: number, y: number}}
     */
    TrigUtils.mapCartesianToDocument = function (v, halfWidth, halfHeight) {
        var x = Math.round(v.x + halfWidth);
        var y = Math.abs(v.y - halfHeight);
        return { x: x, y: y };
    };
    /**
     * Addition of two 2D vectors
     * @param v1
     * @param v2
     * @returns {Vector2D}
     */
    TrigUtils.addVectors = function (v1, v2) {
        return new vector_class_1.Vector2D(v1.x + v2.x, v1.y + v2.y);
    };
    /**
     * Generate a random number between -1 and 1
     * If request is for x co-ord then use cosine, for y use sine
     * @param isX
     * @returns {number}
     */
    TrigUtils.getRandom = function (isX) {
        if (isX === void 0) { isX = true; }
        var isPositive = Math.random() >= 0.5;
        var rand = isX ? Math.cos(Math.random()) : Math.sin(Math.random());
        return isPositive ? rand * SPEED_SCALE : -rand * SPEED_SCALE;
    };
    /**
     * Tests if the current `pos` is touching or outside the left and right side of the bounding box
     * @param pos
     * @param ball
     * @param leftLimit
     * @param rightLimit
     * @returns {Vector2D}
     */
    TrigUtils.testSides = function (pos, ball, leftLimit, rightLimit) {
        var diameter = ball.radius * 2;
        if (pos.x < leftLimit || pos.x > (rightLimit - diameter)) {
            return new vector_class_1.Vector2D(-ball.velocity.x, -Math.sin(RIGHT_ANGLE));
        }
        return ball.velocity;
    };
    /**
     * If ball hits the top, reflect it back down
     * @param pos
     * @param ball
     * @param ceiling
     * @returns {Vector2D}
     */
    TrigUtils.testCeiling = function (pos, ball, ceiling) {
        if (pos.y >= ceiling) {
            return new vector_class_1.Vector2D(ball.velocity.x, -ball.velocity.y);
        }
        return ball.velocity;
    };
    /**
     * If the ball hits the floor, returns boolean to indicate as such
     * @param pos
     * @param ball
     * @param floor
     * @returns {boolean}
     */
    TrigUtils.testFloor = function (pos, ball, floor) {
        var diameter = ball.radius * 2;
        return pos.y <= (floor + diameter);
    };
    return TrigUtils;
}());
exports.TrigUtils = TrigUtils;

},{"../models/vector.class":6}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Ball = (function () {
    function Ball() {
    }
    return Ball;
}());
exports.Ball = Ball;

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Vector2D = (function () {
    function Vector2D(x, y) {
        this.x = x;
        this.y = y;
    }
    return Vector2D;
}());
exports.Vector2D = Vector2D;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvdHMvYm9vdHN0cmFwLnRzIiwic3JjL3RzL2NsYXNzZXMvYW5pbWF0ZS5jbGFzcy50cyIsInNyYy90cy9jbGFzc2VzL2JvdW5jaW5nLWJhbGxzLWFwcC5jbGFzcy50cyIsInNyYy90cy9jbGFzc2VzL3RyaWctdXRpbHMuY2xhc3MudHMiLCJzcmMvdHMvbW9kZWxzL2JhbGwuY2xhc3MudHMiLCJzcmMvdHMvbW9kZWxzL3ZlY3Rvci5jbGFzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsK0VBQXNFO0FBRXRFLElBQU0sR0FBRyxHQUFHLElBQUksMkNBQWdCLEVBQUUsQ0FBQztBQUNuQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7Ozs7O0FDSFgsbURBQTRDO0FBQzVDLHVEQUFrRDtBQUNsRCx1REFBK0M7QUFFL0MsSUFBTSxVQUFVLEdBQUcsR0FBRyxDQUFDO0FBQ3ZCLElBQU0sbUJBQW1CLEdBQUcsSUFBSSxDQUFDO0FBRWpDO0lBV0ksaUJBQW9CLFdBQXdCO1FBQXhCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBVnBDLFVBQUssR0FBZ0IsRUFBRSxDQUFDO1FBVzVCLElBQUksQ0FBQyxLQUFLLEdBQUcsV0FBVyxDQUFDLFdBQVcsQ0FBQztRQUNyQyxJQUFJLENBQUMsTUFBTSxHQUFHLFdBQVcsQ0FBQyxZQUFZLENBQUM7UUFDdkMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNoQyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUNqQyxJQUFJ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QixHQUFhLEVBQUUsSUFBVSxFQUFFLE9BQWU7UUFDekQsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ25CLE1BQU0sQ0FBQyxJQUFJLHVCQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNELENBQUM7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN6QixDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0ksbUJBQVMsR0FBaEIsVUFBaUIsR0FBYSxFQUFFLElBQVUsRUFBRSxLQUFhO1FBQ3JELElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ2pDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFDTCxnQkFBQztBQUFELENBeEZBLEFBd0ZDLElBQUE7QUF4RlksOEJBQVM7Ozs7O0FDSnRCO0lBQUE7SUFhQSxDQUFDO0lBQUQsV0FBQztBQUFELENBYkEsQUFhQyxJQUFBO0FBYlksb0JBQUk7Ozs7O0FDRmpCO0lBQ0ksa0JBQVksQ0FBUyxFQUFFLENBQVM7UUFDNUIsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWCxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNmLENBQUM7SUFHTCxlQUFDO0FBQUQsQ0FQQSxBQU9DLElBQUE7QUFQWSw0QkFBUSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgeyBCb3VuY2luZ0JhbGxzQXBwIH0gZnJvbSAnLi9jbGFzc2VzL2JvdW5jaW5nLWJhbGxzLWFwcC5jbGFzcyc7XG5cbmNvbnN0IGFwcCA9IG5ldyBCb3VuY2luZ0JhbGxzQXBwKCk7XG5hcHAuaW5pdCgpO1xuIiwiaW1wb3J0IHsgQmFsbCB9IGZyb20gJy4uL21vZGVscy9iYWxsLmNsYXNzJztcbmltcG9ydCB7IFZlY3RvcjJEIH0gZnJvbSAnLi4vbW9kZWxzL3ZlY3Rvci5jbGFzcyc7XG5pbXBvcnQgeyBUcmlnVXRpbHMgfSBmcm9tICcuL3RyaWctdXRpbHMuY2xhc3MnO1xuXG5jb25zdCBCQUxMX1NDQUxFID0gMTAwO1xuY29uc3QgR1JBVklUWV9DT0VGRklDSUVOVCA9IDAuNzU7XG5cbmV4cG9ydCBjbGFzcyBBbmltYXRlIHtcbiAgICBwcml2YXRlIGJhbGxzOiBBcnJheTxCYWxsPiA9IFtdO1xuICAgIHByaXZhdGUgd2lkdGg6IG51bWJlcjtcbiAgICBwcml2YXRlIGhlaWdodDogbnVtYmVyO1xuICAgIHByaXZhdGUgaGFsZldpZHRoOiBudW1iZXI7XG4gICAgcHJpdmF0ZSBoYWxmSGVpZ2h0OiBudW1iZXI7XG4gICAgcHJpdmF0ZSBsZWZ0TGltaXQ6IG51bWJlcjtcbiAgICBwcml2YXRlIHJpZ2h0TGltaXQ6IG51bWJlcjtcbiAgICBwcml2YXRlIGZsb29yOiBudW1iZXI7XG4gICAgcHJpdmF0ZSBjZWlsaW5nOiBudW1iZXI7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGJvdW5kaW5nQm94OiBIVE1MRWxlbWVudCkge1xuICAgICAgICB0aGlzLndpZHRoID0gYm91bmRpbmdCb3guY2xpZW50V2lkdGg7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gYm91bmRpbmdCb3guY2xpZW50SGVpZ2h0O1xuICAgICAgICB0aGlzLmhhbGZXaWR0aCA9IHRoaXMud2lkdGggLyAyO1xuICAgICAgICB0aGlzLmhhbGZIZWlnaHQgPSB0aGlzLmhlaWdodCAvIDI7XG4gICAgICAgIHRoaXMubGVmdExpbWl0ID0gLXRoaXMuaGFsZldpZHRoO1xuICAgICAgICB0aGlzLnJpZ2h0TGltaXQgPSB0aGlzLmhhbGZXaWR0aDtcbiAgICAgICAgdGhpcy5mbG9vciA9IC10aGlzLmhhbGZIZWlnaHQ7XG4gICAgICAgIHRoaXMuY2VpbGluZyA9IHRoaXMuaGFsZkhlaWdodDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAgLSBNYXAgY2xpY2sgWCxZIHRvIGNhcnRlc2lhblxuICAgICAqICAtIEdlbmVyYXRlIGEgYmFsbFxuICAgICAqICAtIFBsYWNlIGludG8gYm91bmRpbmcgYm94XG4gICAgICogIC0gQWRkIHRvIGFycmF5IG9mIGJhbGxzXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZXZlbnQgLSBjbGljayBldmVudCBmcm9tIHRoZSBib3VuZGluZyBib3ggZWxlbWVudFxuICAgICAqL1xuICAgIGFkZEJhbGwoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICAgICAgY29uc3QgYmFsbCA9IG5ldyBCYWxsKCksXG4gICAgICAgICAgICBzaXplID0gTWF0aC5yYW5kb20oKSAqIEJBTExfU0NBTEUsXG4gICAgICAgICAgICByYWRpdXMgPSBzaXplIC8gMixcbiAgICAgICAgICAgIHZlbG9jaXR5ID0gbmV3IFZlY3RvcjJEKFRyaWdVdGlscy5nZXRSYW5kb20odHJ1ZSksIFRyaWdVdGlscy5nZXRSYW5kb20oZmFsc2UpKSxcbiAgICAgICAgICAgIGNsaWVudFggPSBldmVudC5jbGllbnRYIC0gcmFkaXVzLFxuICAgICAgICAgICAgY2xpZW50WSA9IGV2ZW50LmNsaWVudFkgLSByYWRpdXM7XG4gICAgICAgIGJhbGwuZWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBiYWxsLmVsZW0uY2xhc3NOYW1lID0gJ2JhbGwnO1xuICAgICAgICBiYWxsLmVsZW0uc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICBiYWxsLmVsZW0uc3R5bGUud2lkdGggPSBzaXplICsgJ3B4JztcbiAgICAgICAgYmFsbC5lbGVtLnN0eWxlLmhlaWdodCA9IHNpemUgKyAncHgnO1xuICAgICAgICBiYWxsLmVsZW0uc3R5bGUubGVmdCA9IGNsaWVudFggKyAncHgnO1xuICAgICAgICBiYWxsLmVsZW0uc3R5bGUudG9wID0gY2xpZW50WSArICdweCc7XG4gICAgICAgIGJhbGwucmFkaXVzID0gcmFkaXVzO1xuICAgICAgICBiYWxsLnZlbG9jaXR5ID0gdmVsb2NpdHk7XG4gICAgICAgIGJhbGwucG9zaXRpb24gPSBUcmlnVXRpbHMubWFwRG9jdW1lbnRUb0NhcnRlc2lhbihuZXcgVmVjdG9yMkQoZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WSksIHRoaXMuaGFsZldpZHRoLCB0aGlzLmhhbGZIZWlnaHQpO1xuICAgICAgICB0aGlzLmJhbGxzLnB1c2goYmFsbCk7XG4gICAgICAgIHRoaXMuYm91bmRpbmdCb3guYXBwZW5kQ2hpbGQoYmFsbC5lbGVtKTtcbiAgICAgICAgaWYgKHRoaXMuYmFsbHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvblRpY2soKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogIC0gT24gdGljaywgYXBwbHkgZGlyZWN0aW9uIHZlY3RvciB0byBwb3NpdGlvbiB2ZWN0b3IgYWNyb3NzIGFsbCBiYWxsc1xuICAgICAqICAtIEFkZCBzb21lIGdyYXZpdHkgdG8gZHJpZnQgZWxlbWVudHMgZG93biB0byB0aGUgYm90dG9tXG4gICAgICogIC0gSWYgYmFsbCBoaXRzIGZsb29yLCBhcHBseSB0aGUgYm91bmNpbmcgQ1NTIGVmZmVjdFxuICAgICAqICAtIE1hcCBjYXJ0ZXNpYW4geCx5IHRvIGRvY3VtZW50IGJhc2VkIHgseSBhbmQgYXBwbHkgdG8gcG9zaXRpb24gb2YgYmFsbCBlbGVtZW50XG4gICAgICovXG4gICAgYW5pbWF0aW9uVGljaygpIHtcbiAgICAgICAgdGhpcy5iYWxscy5mb3JFYWNoKChiYWxsOiBCYWxsKSA9PiB7XG4gICAgICAgICAgICBsZXQgcG9zaXRpb25VcGRhdGU6IFZlY3RvcjJELFxuICAgICAgICAgICAgICAgIGRvY3VtZW50UG9zaXRpb25VcGRhdGU6IFZlY3RvcjJEO1xuICAgICAgICAgICAgYmFsbC5yZWFjaGVkRmxvb3IgPSBUcmlnVXRpbHMudGVzdEZsb29yKGJhbGwucG9zaXRpb24sIGJhbGwsIHRoaXMuZmxvb3IpO1xuICAgICAgICAgICAgaWYgKGJhbGwucmVhY2hlZEZsb29yKSB7XG4gICAgICAgICAgICAgICAgYmFsbC52ZWxvY2l0eSA9IG5ldyBWZWN0b3IyRCgwLCAwKTtcbiAgICAgICAgICAgICAgICBiYWxsLmVsZW0uY2xhc3NMaXN0LmFkZCgnYm91bmNlJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYmFsbC52ZWxvY2l0eSA9IFRyaWdVdGlscy50ZXN0U2lkZXMoYmFsbC5wb3NpdGlvbiwgYmFsbCwgdGhpcy5sZWZ0TGltaXQsIHRoaXMucmlnaHRMaW1pdCk7XG4gICAgICAgICAgICBiYWxsLnZlbG9jaXR5ID0gVHJpZ1V0aWxzLnRlc3RDZWlsaW5nKGJhbGwucG9zaXRpb24sIGJhbGwsIHRoaXMuY2VpbGluZyk7XG4gICAgICAgICAgICBwb3NpdGlvblVwZGF0ZSA9IFRyaWdVdGlscy5hZGRWZWN0b3JzKGJhbGwucG9zaXRpb24sIGJhbGwudmVsb2NpdHkpO1xuICAgICAgICAgICAgcG9zaXRpb25VcGRhdGUueSAtPSBHUkFWSVRZX0NPRUZGSUNJRU5UOyAvLyBhZGQgZ3Jhdml0eSBlZmZlY3RcbiAgICAgICAgICAgIGJhbGwucG9zaXRpb24gPSBwb3NpdGlvblVwZGF0ZTtcbiAgICAgICAgICAgIGRvY3VtZW50UG9zaXRpb25VcGRhdGUgPSBUcmlnVXRpbHMubWFwQ2FydGVzaWFuVG9Eb2N1bWVudChwb3NpdGlvblVwZGF0ZSwgdGhpcy5oYWxmV2lkdGgsIHRoaXMuaGFsZkhlaWdodCk7XG4gICAgICAgICAgICBiYWxsLmVsZW0uc3R5bGUubGVmdCA9IGRvY3VtZW50UG9zaXRpb25VcGRhdGUueCArICdweCc7XG4gICAgICAgICAgICBiYWxsLmVsZW0uc3R5bGUudG9wID0gZG9jdW1lbnRQb3NpdGlvblVwZGF0ZS55ICsgJ3B4JztcbiAgICAgICAgfSk7XG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGhpcy5hbmltYXRpb25UaWNrKCkpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IEFuaW1hdGUgfSBmcm9tICcuL2FuaW1hdGUuY2xhc3MnO1xuXG5leHBvcnQgY2xhc3MgQm91bmNpbmdCYWxsc0FwcCB7XG4gICAgaW5pdCgpIHtcbiAgICAgICAgY29uc3QgYm91bmRpbmdCb3ggPSA8SFRNTFNjcmlwdEVsZW1lbnQ+ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJvdW5kaW5nLWJveCcpO1xuICAgICAgICBsZXQgYW5pbWF0ZTogQW5pbWF0ZTtcbiAgICAgICAgYm91bmRpbmdCb3guc3R5bGUuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0ICsgJ3B4JztcbiAgICAgICAgYW5pbWF0ZSA9IG5ldyBBbmltYXRlKGJvdW5kaW5nQm94KTtcbiAgICAgICAgYm91bmRpbmdCb3guYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZ0OiBNb3VzZUV2ZW50KSA9PiBhbmltYXRlLmFkZEJhbGwoZXZ0KSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgVmVjdG9yMkQgfSBmcm9tICcuLi9tb2RlbHMvdmVjdG9yLmNsYXNzJztcbmltcG9ydCB7IEJhbGwgfSBmcm9tICcuLi9tb2RlbHMvYmFsbC5jbGFzcyc7XG5cbmNvbnN0IFNQRUVEX1NDQUxFID0gMTA7XG5jb25zdCBSSUdIVF9BTkdMRSA9IDkwO1xuXG5leHBvcnQgY2xhc3MgVHJpZ1V0aWxzIHtcbiAgICAvKipcbiAgICAgKiBHaXZlbiB0aGUgY2xpZW50WCBhbmQgY2xpZW50WSAoYXMgVmVjdG9yMkQpLCBjb252ZXJ0IHRvIENhcnRlc2lhbiBzcGFjZSB2ZWN0b3JcbiAgICAgKiBAcGFyYW0gZG9jdW1lbnRWZWN0b3JcbiAgICAgKiBAcGFyYW0gaGFsZldpZHRoXG4gICAgICogQHBhcmFtIGhhbGZIZWlnaHRcbiAgICAgKiBAcmV0dXJucyB7VmVjdG9yMkR9XG4gICAgICovXG4gICAgc3RhdGljIG1hcERvY3VtZW50VG9DYXJ0ZXNpYW4oZG9jdW1lbnRWZWN0b3I6IFZlY3RvcjJELCBoYWxmV2lkdGg6IG51bWJlciwgaGFsZkhlaWdodDogbnVtYmVyKTogVmVjdG9yMkQge1xuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjJEKGRvY3VtZW50VmVjdG9yLnggLSBoYWxmV2lkdGgsIC1kb2N1bWVudFZlY3Rvci55ICsgaGFsZkhlaWdodCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogV2lsbCBjb252ZXJ0IENhcnRlc2lhbiBzcGFjZSB0byBkb2N1bWVudCAoRE9NKSBjb29yZGluYXRlc1xuICAgICAqIEBwYXJhbSB2XG4gICAgICogQHBhcmFtIGhhbGZXaWR0aFxuICAgICAqIEBwYXJhbSBoYWxmSGVpZ2h0XG4gICAgICogQHJldHVybnMge3t4OiBudW1iZXIsIHk6IG51bWJlcn19XG4gICAgICovXG4gICAgc3RhdGljIG1hcENhcnRlc2lhblRvRG9jdW1lbnQodjogVmVjdG9yMkQsIGhhbGZXaWR0aDogbnVtYmVyLCBoYWxmSGVpZ2h0OiBudW1iZXIpOiBWZWN0b3IyRCB7XG4gICAgICAgIGNvbnN0IHggPSBNYXRoLnJvdW5kKHYueCArIGhhbGZXaWR0aCk7XG4gICAgICAgIGNvbnN0IHkgPSBNYXRoLmFicyh2LnkgLSBoYWxmSGVpZ2h0KTtcbiAgICAgICAgcmV0dXJuIHsgeCwgeSB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZGl0aW9uIG9mIHR3byAyRCB2ZWN0b3JzXG4gICAgICogQHBhcmFtIHYxXG4gICAgICogQHBhcmFtIHYyXG4gICAgICogQHJldHVybnMge1ZlY3RvcjJEfVxuICAgICAqL1xuICAgIHN0YXRpYyBhZGRWZWN0b3JzKHYxOiBWZWN0b3IyRCwgdjI6IFZlY3RvcjJEKTogVmVjdG9yMkQge1xuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjJEKHYxLnggKyB2Mi54LCB2MS55ICsgdjIueSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2VuZXJhdGUgYSByYW5kb20gbnVtYmVyIGJldHdlZW4gLTEgYW5kIDFcbiAgICAgKiBJZiByZXF1ZXN0IGlzIGZvciB4IGNvLW9yZCB0aGVuIHVzZSBjb3NpbmUsIGZvciB5IHVzZSBzaW5lXG4gICAgICogQHBhcmFtIGlzWFxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgICovXG4gICAgc3RhdGljIGdldFJhbmRvbShpc1g6IGJvb2xlYW4gPSB0cnVlKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3QgaXNQb3NpdGl2ZTogYm9vbGVhbiA9IE1hdGgucmFuZG9tKCkgPj0gMC41O1xuICAgICAgICBjb25zdCByYW5kID0gaXNYID8gTWF0aC5jb3MoTWF0aC5yYW5kb20oKSkgOiBNYXRoLnNpbihNYXRoLnJhbmRvbSgpKTtcbiAgICAgICAgcmV0dXJuIGlzUG9zaXRpdmUgPyByYW5kICogU1BFRURfU0NBTEUgOiAtcmFuZCAqIFNQRUVEX1NDQUxFO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRlc3RzIGlmIHRoZSBjdXJyZW50IGBwb3NgIGlzIHRvdWNoaW5nIG9yIG91dHNpZGUgdGhlIGxlZnQgYW5kIHJpZ2h0IHNpZGUgb2YgdGhlIGJvdW5kaW5nIGJveFxuICAgICAqIEBwYXJhbSBwb3NcbiAgICAgKiBAcGFyYW0gYmFsbFxuICAgICAqIEBwYXJhbSBsZWZ0TGltaXRcbiAgICAgKiBAcGFyYW0gcmlnaHRMaW1pdFxuICAgICAqIEByZXR1cm5zIHtWZWN0b3IyRH1cbiAgICAgKi9cbiAgICBzdGF0aWMgdGVzdFNpZGVzKHBvczogVmVjdG9yMkQsIGJhbGw6IEJhbGwsIGxlZnRMaW1pdDogbnVtYmVyLCByaWdodExpbWl0OiBudW1iZXIpOiBWZWN0b3IyRCB7XG4gICAgICAgIGNvbnN0IGRpYW1ldGVyID0gYmFsbC5yYWRpdXMgKiAyO1xuICAgICAgICBpZiAocG9zLnggPCBsZWZ0TGltaXQgfHwgcG9zLnggPiAocmlnaHRMaW1pdCAtIGRpYW1ldGVyKSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyRCgtYmFsbC52ZWxvY2l0eS54LCAtTWF0aC5zaW4oUklHSFRfQU5HTEUpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYmFsbC52ZWxvY2l0eTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJZiBiYWxsIGhpdHMgdGhlIHRvcCwgcmVmbGVjdCBpdCBiYWNrIGRvd25cbiAgICAgKiBAcGFyYW0gcG9zXG4gICAgICogQHBhcmFtIGJhbGxcbiAgICAgKiBAcGFyYW0gY2VpbGluZ1xuICAgICAqIEByZXR1cm5zIHtWZWN0b3IyRH1cbiAgICAgKi9cbiAgICBzdGF0aWMgdGVzdENlaWxpbmcocG9zOiBWZWN0b3IyRCwgYmFsbDogQmFsbCwgY2VpbGluZzogbnVtYmVyKSB7XG4gICAgICAgIGlmIChwb3MueSA+PSBjZWlsaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjJEKGJhbGwudmVsb2NpdHkueCwgLWJhbGwudmVsb2NpdHkueSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGJhbGwudmVsb2NpdHk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSWYgdGhlIGJhbGwgaGl0cyB0aGUgZmxvb3IsIHJldHVybnMgYm9vbGVhbiB0byBpbmRpY2F0ZSBhcyBzdWNoXG4gICAgICogQHBhcmFtIHBvc1xuICAgICAqIEBwYXJhbSBiYWxsXG4gICAgICogQHBhcmFtIGZsb29yXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICovXG4gICAgc3RhdGljIHRlc3RGbG9vcihwb3M6IFZlY3RvcjJELCBiYWxsOiBCYWxsLCBmbG9vcjogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IGRpYW1ldGVyID0gYmFsbC5yYWRpdXMgKiAyO1xuICAgICAgICByZXR1cm4gcG9zLnkgPD0gKGZsb29yICsgZGlhbWV0ZXIpO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBWZWN0b3IyRCB9IGZyb20gJy4vdmVjdG9yLmNsYXNzJztcblxuZXhwb3J0IGNsYXNzIEJhbGwge1xuICAgIC8vIGFjdHVhbCBwb3NpdGlvbiBpbiBib3hcbiAgICBwb3NpdGlvbjogVmVjdG9yMkQ7XG4gICAgcmFkaXVzOiBudW1iZXI7IC8vIHJhZGl1cyBvZiBjaXJjbGVcblxuICAgIC8vIHBvbGFyIGNvb3JkaW5hdGVzIG9mIGRpcmVjdGlvblxuICAgIHZlbG9jaXR5OiBWZWN0b3IyRDtcblxuICAgIC8vIHRoZSBET00gZWxlbVxuICAgIGVsZW06IEhUTUxFbGVtZW50O1xuXG4gICAgLy8gaW5kaWNhdGVzIHRoZSBiYWxsIGhhcyB0b3VjaGVkIHRoZSBib3R0b20gb2Ygd2luZG93XG4gICAgcmVhY2hlZEZsb29yOiBib29sZWFuO1xufVxuIiwiZXhwb3J0IGNsYXNzIFZlY3RvcjJEIHtcbiAgICBjb25zdHJ1Y3Rvcih4OiBudW1iZXIsIHk6IG51bWJlcikge1xuICAgICAgICB0aGlzLnggPSB4O1xuICAgICAgICB0aGlzLnkgPSB5O1xuICAgIH1cbiAgICB4OiBudW1iZXI7XG4gICAgeTogbnVtYmVyO1xufSJdfQ==
