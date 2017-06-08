import { Vector2D } from '../models/vector.class';
import { Ball } from '../models/ball.class';

const SPEED_SCALE = 10;
const RIGHT_ANGLE = 90;

export class TrigUtils {
    /**
     * Given the clientX and clientY (as Vector2D), convert to Cartesian space vector
     * @param documentVector
     * @param halfWidth
     * @param halfHeight
     * @returns {Vector2D}
     */
    static mapDocumentToCartesian(documentVector: Vector2D, halfWidth: number, halfHeight: number): Vector2D {
        return new Vector2D(documentVector.x - halfWidth, -documentVector.y + halfHeight);
    }

    /**
     * Will convert Cartesian space to document (DOM) coordinates
     * @param v
     * @param halfWidth
     * @param halfHeight
     * @returns {{x: number, y: number}}
     */
    static mapCartesianToDocument(v: Vector2D, halfWidth: number, halfHeight: number): Vector2D {
        const x = Math.round(v.x + halfWidth);
        const y = Math.abs(v.y - halfHeight);
        return { x, y };
    }

    /**
     * Addition of two 2D vectors
     * @param v1
     * @param v2
     * @returns {Vector2D}
     */
    static addVectors(v1: Vector2D, v2: Vector2D): Vector2D {
        return new Vector2D(v1.x + v2.x, v1.y + v2.y);
    }

    /**
     * Generate a random number between -1 and 1
     * If request is for x co-ord then use cosine, for y use sine
     * @param isX
     * @returns {number}
     */
    static getRandom(isX: boolean = true): number {
        const isPositive: boolean = Math.random() >= 0.5;
        const rand = isX ? Math.cos(Math.random()) : Math.sin(Math.random());
        return isPositive ? rand * SPEED_SCALE : -rand * SPEED_SCALE;
    }

    /**
     * Tests if the current `pos` is touching or outside the left and right side of the bounding box
     * @param pos
     * @param ball
     * @param leftLimit
     * @param rightLimit
     * @returns {Vector2D}
     */
    static testSides(pos: Vector2D, ball: Ball, leftLimit: number, rightLimit: number): Vector2D {
        const diameter = ball.radius * 2;
        if (pos.x < leftLimit || pos.x > (rightLimit - diameter)) {
            return new Vector2D(-ball.velocity.x, -Math.sin(RIGHT_ANGLE));
        }
        return ball.velocity;
    }

    /**
     * If ball hits the top, reflect it back down
     * @param pos
     * @param ball
     * @param ceiling
     * @returns {Vector2D}
     */
    static testCeiling(pos: Vector2D, ball: Ball, ceiling: number) {
        if (pos.y >= ceiling) {
            return new Vector2D(ball.velocity.x, -ball.velocity.y);
        }
        return ball.velocity;
    }

    /**
     * If the ball hits the floor, returns boolean to indicate as such
     * @param pos
     * @param ball
     * @param floor
     * @returns {boolean}
     */
    static testFloor(pos: Vector2D, ball: Ball, floor: number): boolean {
        const diameter = ball.radius * 2;
        return pos.y <= (floor + diameter);
    }
}