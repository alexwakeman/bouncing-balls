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
            ball.reachedFloor = trig_utils_class_1.TrigUtils.testFloor(ball, _this.floor);
            if (ball.reachedFloor) {
                ball.velocity = new vector_class_1.Vector2D(0, 0);
                ball.elem.classList.add('bounce');
                return;
            }
            ball.velocity = trig_utils_class_1.TrigUtils.testSides(ball, _this.leftLimit, _this.rightLimit);
            ball.velocity = trig_utils_class_1.TrigUtils.testCeiling(ball, _this.ceiling);
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
     * Tests if the ball is touching or outside the left and right side of the bounding box.
     * Reflects the velocity vector y-axis by 90 degrees, and reflects the x-axis if touching the sides
     * @param ball
     * @param leftLimit
     * @param rightLimit
     * @returns {Vector2D}
     */
    TrigUtils.testSides = function (ball, leftLimit, rightLimit) {
        var diameter = ball.radius * 2;
        if (ball.position.x < leftLimit || ball.position.x > (rightLimit - diameter)) {
            return new vector_class_1.Vector2D(-ball.velocity.x, -Math.sin(RIGHT_ANGLE));
        }
        return ball.velocity;
    };
    /**
     * If ball hits the top, reflect it back down
     * @param ball
     * @param ceiling
     * @returns {Vector2D}
     */
    TrigUtils.testCeiling = function (ball, ceiling) {
        if (ball.position.y >= ceiling) {
            return new vector_class_1.Vector2D(ball.velocity.x, -ball.velocity.y);
        }
        return ball.velocity;
    };
    /**
     * If the ball hits the floor, returns boolean to indicate as such
     * @param ball
     * @param floor
     * @returns {boolean}
     */
    TrigUtils.testFloor = function (ball, floor) {
        var diameter = ball.radius * 2;
        return ball.position.y <= (floor + diameter);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvdHMvYm9vdHN0cmFwLnRzIiwic3JjL3RzL2NsYXNzZXMvYW5pbWF0ZS5jbGFzcy50cyIsInNyYy90cy9jbGFzc2VzL2JvdW5jaW5nLWJhbGxzLWFwcC5jbGFzcy50cyIsInNyYy90cy9jbGFzc2VzL3RyaWctdXRpbHMuY2xhc3MudHMiLCJzcmMvdHMvbW9kZWxzL2JhbGwuY2xhc3MudHMiLCJzcmMvdHMvbW9kZWxzL3ZlY3Rvci5jbGFzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsK0VBQXNFO0FBRXRFLElBQU0sR0FBRyxHQUFHLElBQUksMkNBQWdCLEVBQUUsQ0FBQztBQUNuQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7Ozs7O0FDSFgsbURBQTRDO0FBQzVDLHVEQUFrRDtBQUNsRCx1REFBK0M7QUFFL0MsSUFBTSxVQUFVLEdBQUcsR0FBRyxDQUFDO0FBQ3ZCLElBQU0sbUJBQW1CLEdBQUcsSUFBSSxDQUFDO0FBRWpDO0lBV0ksaUJBQW9CLFdBQXdCO1FBQXhCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBVnBDLFVBQUssR0FBZ0IsRUFBRSxDQUFDO1FBVzVCLElBQUksQ0FBQyxLQUFLLEdBQUcsV0FBVyxDQUFDLFdBQVcsQ0FBQztRQUNyQyxJQUFJLENBQUMsTUFBTSxHQUFHLFdBQVcsQ0FBQyxZQUFZLENBQUM7UUFDdkMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNoQyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUNqQyxJQUFJ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USxDQUFDLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQzdCLE1BQU0sQ0FBQyxJQUFJLHVCQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNELENBQUM7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN6QixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSSxtQkFBUyxHQUFoQixVQUFpQixJQUFVLEVBQUUsS0FBYTtRQUN0QyxJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUNqQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLENBQUM7SUFDakQsQ0FBQztJQUNMLGdCQUFDO0FBQUQsQ0F0RkEsQUFzRkMsSUFBQTtBQXRGWSw4QkFBUzs7Ozs7QUNKdEI7SUFBQTtJQWFBLENBQUM7SUFBRCxXQUFDO0FBQUQsQ0FiQSxBQWFDLElBQUE7QUFiWSxvQkFBSTs7Ozs7QUNGakI7SUFDSSxrQkFBWSxDQUFTLEVBQUUsQ0FBUztRQUM1QixJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNYLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2YsQ0FBQztJQUdMLGVBQUM7QUFBRCxDQVBBLEFBT0MsSUFBQTtBQVBZLDRCQUFRIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCB7IEJvdW5jaW5nQmFsbHNBcHAgfSBmcm9tICcuL2NsYXNzZXMvYm91bmNpbmctYmFsbHMtYXBwLmNsYXNzJztcblxuY29uc3QgYXBwID0gbmV3IEJvdW5jaW5nQmFsbHNBcHAoKTtcbmFwcC5pbml0KCk7XG4iLCJpbXBvcnQgeyBCYWxsIH0gZnJvbSAnLi4vbW9kZWxzL2JhbGwuY2xhc3MnO1xuaW1wb3J0IHsgVmVjdG9yMkQgfSBmcm9tICcuLi9tb2RlbHMvdmVjdG9yLmNsYXNzJztcbmltcG9ydCB7IFRyaWdVdGlscyB9IGZyb20gJy4vdHJpZy11dGlscy5jbGFzcyc7XG5cbmNvbnN0IEJBTExfU0NBTEUgPSAxMDA7XG5jb25zdCBHUkFWSVRZX0NPRUZGSUNJRU5UID0gMC43NTtcblxuZXhwb3J0IGNsYXNzIEFuaW1hdGUge1xuICAgIHByaXZhdGUgYmFsbHM6IEFycmF5PEJhbGw+ID0gW107XG4gICAgcHJpdmF0ZSB3aWR0aDogbnVtYmVyO1xuICAgIHByaXZhdGUgaGVpZ2h0OiBudW1iZXI7XG4gICAgcHJpdmF0ZSBoYWxmV2lkdGg6IG51bWJlcjtcbiAgICBwcml2YXRlIGhhbGZIZWlnaHQ6IG51bWJlcjtcbiAgICBwcml2YXRlIGxlZnRMaW1pdDogbnVtYmVyO1xuICAgIHByaXZhdGUgcmlnaHRMaW1pdDogbnVtYmVyO1xuICAgIHByaXZhdGUgZmxvb3I6IG51bWJlcjtcbiAgICBwcml2YXRlIGNlaWxpbmc6IG51bWJlcjtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgYm91bmRpbmdCb3g6IEhUTUxFbGVtZW50KSB7XG4gICAgICAgIHRoaXMud2lkdGggPSBib3VuZGluZ0JveC5jbGllbnRXaWR0aDtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBib3VuZGluZ0JveC5jbGllbnRIZWlnaHQ7XG4gICAgICAgIHRoaXMuaGFsZldpZHRoID0gdGhpcy53aWR0aCAvIDI7XG4gICAgICAgIHRoaXMuaGFsZkhlaWdodCA9IHRoaXMuaGVpZ2h0IC8gMjtcbiAgICAgICAgdGhpcy5sZWZ0TGltaXQgPSAtdGhpcy5oYWxmV2lkdGg7XG4gICAgICAgIHRoaXMucmlnaHRMaW1pdCA9IHRoaXMuaGFsZldpZHRoO1xuICAgICAgICB0aGlzLmZsb29yID0gLXRoaXMuaGFsZkhlaWdodDtcbiAgICAgICAgdGhpcy5jZWlsaW5nID0gdGhpcy5oYWxmSGVpZ2h0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICAtIE1hcCBjbGljayBYLFkgdG8gY2FydGVzaWFuXG4gICAgICogIC0gR2VuZXJhdGUgYSBiYWxsXG4gICAgICogIC0gUGxhY2UgaW50byBib3VuZGluZyBib3hcbiAgICAgKiAgLSBBZGQgdG8gYXJyYXkgb2YgYmFsbHNcbiAgICAgKlxuICAgICAqIEBwYXJhbSBldmVudCAtIGNsaWNrIGV2ZW50IGZyb20gdGhlIGJvdW5kaW5nIGJveCBlbGVtZW50XG4gICAgICovXG4gICAgYWRkQmFsbChldmVudDogTW91c2VFdmVudCkge1xuICAgICAgICBjb25zdCBiYWxsID0gbmV3IEJhbGwoKSxcbiAgICAgICAgICAgIHNpemUgPSBNYXRoLnJhbmRvbSgpICogQkFMTF9TQ0FMRSxcbiAgICAgICAgICAgIHJhZGl1cyA9IHNpemUgLyAyLFxuICAgICAgICAgICAgdmVsb2NpdHkgPSBuZXcgVmVjdG9yMkQoVHJpZ1V0aWxzLmdldFJhbmRvbSh0cnVlKSwgVHJpZ1V0aWxzLmdldFJhbmRvbShmYWxzZSkpLFxuICAgICAgICAgICAgY2xpZW50WCA9IGV2ZW50LmNsaWVudFggLSByYWRpdXMsXG4gICAgICAgICAgICBjbGllbnRZID0gZXZlbnQuY2xpZW50WSAtIHJhZGl1cztcbiAgICAgICAgYmFsbC5lbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGJhbGwuZWxlbS5jbGFzc05hbWUgPSAnYmFsbCc7XG4gICAgICAgIGJhbGwuZWxlbS5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgIGJhbGwuZWxlbS5zdHlsZS53aWR0aCA9IHNpemUgKyAncHgnO1xuICAgICAgICBiYWxsLmVsZW0uc3R5bGUuaGVpZ2h0ID0gc2l6ZSArICdweCc7XG4gICAgICAgIGJhbGwuZWxlbS5zdHlsZS5sZWZ0ID0gY2xpZW50WCArICdweCc7XG4gICAgICAgIGJhbGwuZWxlbS5zdHlsZS50b3AgPSBjbGllbnRZICsgJ3B4JztcbiAgICAgICAgYmFsbC5yYWRpdXMgPSByYWRpdXM7XG4gICAgICAgIGJhbGwudmVsb2NpdHkgPSB2ZWxvY2l0eTtcbiAgICAgICAgYmFsbC5wb3NpdGlvbiA9IFRyaWdVdGlscy5tYXBEb2N1bWVudFRvQ2FydGVzaWFuKG5ldyBWZWN0b3IyRChldmVudC5jbGllbnRYLCBldmVudC5jbGllbnRZKSwgdGhpcy5oYWxmV2lkdGgsIHRoaXMuaGFsZkhlaWdodCk7XG4gICAgICAgIHRoaXMuYmFsbHMucHVzaChiYWxsKTtcbiAgICAgICAgdGhpcy5ib3VuZGluZ0JveC5hcHBlbmRDaGlsZChiYWxsLmVsZW0pO1xuICAgICAgICBpZiAodGhpcy5iYWxscy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uVGljaygpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAgLSBPbiB0aWNrLCBhcHBseSBkaXJlY3Rpb24gdmVjdG9yIHRvIHBvc2l0aW9uIHZlY3RvciBhY3Jvc3MgYWxsIGJhbGxzXG4gICAgICogIC0gQWRkIHNvbWUgZ3Jhdml0eSB0byBkcmlmdCBlbGVtZW50cyBkb3duIHRvIHRoZSBib3R0b21cbiAgICAgKiAgLSBJZiBiYWxsIGhpdHMgZmxvb3IsIGFwcGx5IHRoZSBib3VuY2luZyBDU1MgZWZmZWN0XG4gICAgICogIC0gTWFwIGNhcnRlc2lhbiB4LHkgdG8gZG9jdW1lbnQgYmFzZWQgeCx5IGFuZCBhcHBseSB0byBwb3NpdGlvbiBvZiBiYWxsIGVsZW1lbnRcbiAgICAgKi9cbiAgICBhbmltYXRpb25UaWNrKCkge1xuICAgICAgICB0aGlzLmJhbGxzLmZvckVhY2goKGJhbGw6IEJhbGwpID0+IHtcbiAgICAgICAgICAgIGxldCBwb3NpdGlvblVwZGF0ZTogVmVjdG9yMkQsXG4gICAgICAgICAgICAgICAgZG9jdW1lbnRQb3NpdGlvblVwZGF0ZTogVmVjdG9yMkQ7XG4gICAgICAgICAgICBiYWxsLnJlYWNoZWRGbG9vciA9IFRyaWdVdGlscy50ZXN0Rmxvb3IoYmFsbCwgdGhpcy5mbG9vcik7XG4gICAgICAgICAgICBpZiAoYmFsbC5yZWFjaGVkRmxvb3IpIHtcbiAgICAgICAgICAgICAgICBiYWxsLnZlbG9jaXR5ID0gbmV3IFZlY3RvcjJEKDAsIDApO1xuICAgICAgICAgICAgICAgIGJhbGwuZWxlbS5jbGFzc0xpc3QuYWRkKCdib3VuY2UnKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBiYWxsLnZlbG9jaXR5ID0gVHJpZ1V0aWxzLnRlc3RTaWRlcyhiYWxsLCB0aGlzLmxlZnRMaW1pdCwgdGhpcy5yaWdodExpbWl0KTtcbiAgICAgICAgICAgIGJhbGwudmVsb2NpdHkgPSBUcmlnVXRpbHMudGVzdENlaWxpbmcoYmFsbCwgdGhpcy5jZWlsaW5nKTtcbiAgICAgICAgICAgIHBvc2l0aW9uVXBkYXRlID0gVHJpZ1V0aWxzLmFkZFZlY3RvcnMoYmFsbC5wb3NpdGlvbiwgYmFsbC52ZWxvY2l0eSk7XG4gICAgICAgICAgICBwb3NpdGlvblVwZGF0ZS55IC09IEdSQVZJVFlfQ09FRkZJQ0lFTlQ7IC8vIGFkZCBncmF2aXR5IGVmZmVjdFxuICAgICAgICAgICAgYmFsbC5wb3NpdGlvbiA9IHBvc2l0aW9uVXBkYXRlO1xuICAgICAgICAgICAgZG9jdW1lbnRQb3NpdGlvblVwZGF0ZSA9IFRyaWdVdGlscy5tYXBDYXJ0ZXNpYW5Ub0RvY3VtZW50KHBvc2l0aW9uVXBkYXRlLCB0aGlzLmhhbGZXaWR0aCwgdGhpcy5oYWxmSGVpZ2h0KTtcbiAgICAgICAgICAgIGJhbGwuZWxlbS5zdHlsZS5sZWZ0ID0gZG9jdW1lbnRQb3NpdGlvblVwZGF0ZS54ICsgJ3B4JztcbiAgICAgICAgICAgIGJhbGwuZWxlbS5zdHlsZS50b3AgPSBkb2N1bWVudFBvc2l0aW9uVXBkYXRlLnkgKyAncHgnO1xuICAgICAgICB9KTtcbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0aGlzLmFuaW1hdGlvblRpY2soKSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgQW5pbWF0ZSB9IGZyb20gJy4vYW5pbWF0ZS5jbGFzcyc7XG5cbmV4cG9ydCBjbGFzcyBCb3VuY2luZ0JhbGxzQXBwIHtcbiAgICBpbml0KCkge1xuICAgICAgICBjb25zdCBib3VuZGluZ0JveCA9IDxIVE1MRWxlbWVudD5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYm91bmRpbmctYm94Jyk7XG4gICAgICAgIGxldCBhbmltYXRlOiBBbmltYXRlO1xuICAgICAgICBib3VuZGluZ0JveC5zdHlsZS5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQgKyAncHgnO1xuICAgICAgICBhbmltYXRlID0gbmV3IEFuaW1hdGUoYm91bmRpbmdCb3gpO1xuICAgICAgICBib3VuZGluZ0JveC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldnQ6IE1vdXNlRXZlbnQpID0+IGFuaW1hdGUuYWRkQmFsbChldnQpKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBWZWN0b3IyRCB9IGZyb20gJy4uL21vZGVscy92ZWN0b3IuY2xhc3MnO1xuaW1wb3J0IHsgQmFsbCB9IGZyb20gJy4uL21vZGVscy9iYWxsLmNsYXNzJztcblxuY29uc3QgU1BFRURfU0NBTEUgPSAxMDtcbmNvbnN0IFJJR0hUX0FOR0xFID0gOTA7XG5cbmV4cG9ydCBjbGFzcyBUcmlnVXRpbHMge1xuICAgIC8qKlxuICAgICAqIEdpdmVuIHRoZSBjbGllbnRYIGFuZCBjbGllbnRZIChhcyBWZWN0b3IyRCksIGNvbnZlcnQgdG8gQ2FydGVzaWFuIHNwYWNlIHZlY3RvclxuICAgICAqIEBwYXJhbSBkb2N1bWVudFZlY3RvclxuICAgICAqIEBwYXJhbSBoYWxmV2lkdGhcbiAgICAgKiBAcGFyYW0gaGFsZkhlaWdodFxuICAgICAqIEByZXR1cm5zIHtWZWN0b3IyRH1cbiAgICAgKi9cbiAgICBzdGF0aWMgbWFwRG9jdW1lbnRUb0NhcnRlc2lhbihkb2N1bWVudFZlY3RvcjogVmVjdG9yMkQsIGhhbGZXaWR0aDogbnVtYmVyLCBoYWxmSGVpZ2h0OiBudW1iZXIpOiBWZWN0b3IyRCB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMkQoZG9jdW1lbnRWZWN0b3IueCAtIGhhbGZXaWR0aCwgLWRvY3VtZW50VmVjdG9yLnkgKyBoYWxmSGVpZ2h0KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBXaWxsIGNvbnZlcnQgQ2FydGVzaWFuIHNwYWNlIHRvIGRvY3VtZW50IChET00pIGNvb3JkaW5hdGVzXG4gICAgICogQHBhcmFtIHZcbiAgICAgKiBAcGFyYW0gaGFsZldpZHRoXG4gICAgICogQHBhcmFtIGhhbGZIZWlnaHRcbiAgICAgKiBAcmV0dXJucyB7e3g6IG51bWJlciwgeTogbnVtYmVyfX1cbiAgICAgKi9cbiAgICBzdGF0aWMgbWFwQ2FydGVzaWFuVG9Eb2N1bWVudCh2OiBWZWN0b3IyRCwgaGFsZldpZHRoOiBudW1iZXIsIGhhbGZIZWlnaHQ6IG51bWJlcik6IFZlY3RvcjJEIHtcbiAgICAgICAgY29uc3QgeCA9IE1hdGgucm91bmQodi54ICsgaGFsZldpZHRoKTtcbiAgICAgICAgY29uc3QgeSA9IE1hdGguYWJzKHYueSAtIGhhbGZIZWlnaHQpO1xuICAgICAgICByZXR1cm4geyB4LCB5IH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkaXRpb24gb2YgdHdvIDJEIHZlY3RvcnNcbiAgICAgKiBAcGFyYW0gdjFcbiAgICAgKiBAcGFyYW0gdjJcbiAgICAgKiBAcmV0dXJucyB7VmVjdG9yMkR9XG4gICAgICovXG4gICAgc3RhdGljIGFkZFZlY3RvcnModjE6IFZlY3RvcjJELCB2MjogVmVjdG9yMkQpOiBWZWN0b3IyRCB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMkQodjEueCArIHYyLngsIHYxLnkgKyB2Mi55KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZW5lcmF0ZSBhIHJhbmRvbSBudW1iZXIgYmV0d2VlbiAtMSBhbmQgMVxuICAgICAqIElmIHJlcXVlc3QgaXMgZm9yIHggY28tb3JkIHRoZW4gdXNlIGNvc2luZSwgZm9yIHkgdXNlIHNpbmVcbiAgICAgKiBAcGFyYW0gaXNYXG4gICAgICogQHJldHVybnMge251bWJlcn1cbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0UmFuZG9tKGlzWDogYm9vbGVhbiA9IHRydWUpOiBudW1iZXIge1xuICAgICAgICBjb25zdCBpc1Bvc2l0aXZlOiBib29sZWFuID0gTWF0aC5yYW5kb20oKSA+PSAwLjU7XG4gICAgICAgIGNvbnN0IHJhbmQgPSBpc1ggPyBNYXRoLmNvcyhNYXRoLnJhbmRvbSgpKSA6IE1hdGguc2luKE1hdGgucmFuZG9tKCkpO1xuICAgICAgICByZXR1cm4gaXNQb3NpdGl2ZSA/IHJhbmQgKiBTUEVFRF9TQ0FMRSA6IC1yYW5kICogU1BFRURfU0NBTEU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGVzdHMgaWYgdGhlIGJhbGwgaXMgdG91Y2hpbmcgb3Igb3V0c2lkZSB0aGUgbGVmdCBhbmQgcmlnaHQgc2lkZSBvZiB0aGUgYm91bmRpbmcgYm94LlxuICAgICAqIFJlZmxlY3RzIHRoZSB2ZWxvY2l0eSB2ZWN0b3IgeS1heGlzIGJ5IDkwIGRlZ3JlZXMsIGFuZCByZWZsZWN0cyB0aGUgeC1heGlzIGlmIHRvdWNoaW5nIHRoZSBzaWRlc1xuICAgICAqIEBwYXJhbSBiYWxsXG4gICAgICogQHBhcmFtIGxlZnRMaW1pdFxuICAgICAqIEBwYXJhbSByaWdodExpbWl0XG4gICAgICogQHJldHVybnMge1ZlY3RvcjJEfVxuICAgICAqL1xuICAgIHN0YXRpYyB0ZXN0U2lkZXMoYmFsbDogQmFsbCwgbGVmdExpbWl0OiBudW1iZXIsIHJpZ2h0TGltaXQ6IG51bWJlcik6IFZlY3RvcjJEIHtcbiAgICAgICAgY29uc3QgZGlhbWV0ZXIgPSBiYWxsLnJhZGl1cyAqIDI7XG4gICAgICAgIGlmIChiYWxsLnBvc2l0aW9uLnggPCBsZWZ0TGltaXQgfHwgYmFsbC5wb3NpdGlvbi54ID4gKHJpZ2h0TGltaXQgLSBkaWFtZXRlcikpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmVjdG9yMkQoLWJhbGwudmVsb2NpdHkueCwgLU1hdGguc2luKFJJR0hUX0FOR0xFKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGJhbGwudmVsb2NpdHk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSWYgYmFsbCBoaXRzIHRoZSB0b3AsIHJlZmxlY3QgaXQgYmFjayBkb3duXG4gICAgICogQHBhcmFtIGJhbGxcbiAgICAgKiBAcGFyYW0gY2VpbGluZ1xuICAgICAqIEByZXR1cm5zIHtWZWN0b3IyRH1cbiAgICAgKi9cbiAgICBzdGF0aWMgdGVzdENlaWxpbmcoYmFsbDogQmFsbCwgY2VpbGluZzogbnVtYmVyKSB7XG4gICAgICAgIGlmIChiYWxsLnBvc2l0aW9uLnkgPj0gY2VpbGluZykge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyRChiYWxsLnZlbG9jaXR5LngsIC1iYWxsLnZlbG9jaXR5LnkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBiYWxsLnZlbG9jaXR5O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIElmIHRoZSBiYWxsIGhpdHMgdGhlIGZsb29yLCByZXR1cm5zIGJvb2xlYW4gdG8gaW5kaWNhdGUgYXMgc3VjaFxuICAgICAqIEBwYXJhbSBiYWxsXG4gICAgICogQHBhcmFtIGZsb29yXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICovXG4gICAgc3RhdGljIHRlc3RGbG9vcihiYWxsOiBCYWxsLCBmbG9vcjogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IGRpYW1ldGVyID0gYmFsbC5yYWRpdXMgKiAyO1xuICAgICAgICByZXR1cm4gYmFsbC5wb3NpdGlvbi55IDw9IChmbG9vciArIGRpYW1ldGVyKTtcbiAgICB9XG59IiwiaW1wb3J0IHsgVmVjdG9yMkQgfSBmcm9tICcuL3ZlY3Rvci5jbGFzcyc7XG5cbmV4cG9ydCBjbGFzcyBCYWxsIHtcbiAgICAvLyBhY3R1YWwgcG9zaXRpb24gaW4gYm94XG4gICAgcG9zaXRpb246IFZlY3RvcjJEO1xuICAgIHJhZGl1czogbnVtYmVyOyAvLyByYWRpdXMgb2YgY2lyY2xlXG5cbiAgICAvLyBwb2xhciBjb29yZGluYXRlcyBvZiBkaXJlY3Rpb25cbiAgICB2ZWxvY2l0eTogVmVjdG9yMkQ7XG5cbiAgICAvLyB0aGUgRE9NIGVsZW1cbiAgICBlbGVtOiBIVE1MRWxlbWVudDtcblxuICAgIC8vIGluZGljYXRlcyB0aGUgYmFsbCBoYXMgdG91Y2hlZCB0aGUgYm90dG9tIG9mIHdpbmRvd1xuICAgIHJlYWNoZWRGbG9vcjogYm9vbGVhbjtcbn1cbiIsImV4cG9ydCBjbGFzcyBWZWN0b3IyRCB7XG4gICAgY29uc3RydWN0b3IoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy54ID0geDtcbiAgICAgICAgdGhpcy55ID0geTtcbiAgICB9XG4gICAgeDogbnVtYmVyO1xuICAgIHk6IG51bWJlcjtcbn0iXX0=
