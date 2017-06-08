import { Ball } from '../models/ball.class';
import { Vector2D } from '../models/vector.class';
import { TrigUtils } from './trig-utils.class';

const BALL_SCALE = 100;
const GRAVITY_COEFFICIENT = 0.75;

export class Animate {
    private balls: Array<Ball> = [];
    private width: number;
    private height: number;
    private halfWidth: number;
    private halfHeight: number;
    private leftLimit: number;
    private rightLimit: number;
    private floor: number;
    private ceiling: number;

    constructor(private boundingBox: HTMLElement) {
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
    addBall(event: MouseEvent) {
        const ball = new Ball(),
            size = Math.random() * BALL_SCALE,
            radius = size / 2,
            velocity = new Vector2D(TrigUtils.getRandom(true), TrigUtils.getRandom(false)),
            clientX = event.clientX - radius,
            clientY = event.clientY - radius;
        ball.elem = document.createElement('div');
        ball.elem.className = 'ball';
        ball.elem.style.position = 'absolute';
        ball.elem.style.width = size + 'px';
        ball.elem.style.height = size + 'px';
        ball.elem.style.left = clientX + 'px';
        ball.elem.style.top = clientY + 'px';
        ball.radius = radius;
        ball.velocity = velocity;
        ball.position = TrigUtils.mapDocumentToCartesian(new Vector2D(event.clientX, event.clientY), this.halfWidth, this.halfHeight);
        this.balls.push(ball);
        this.boundingBox.appendChild(ball.elem);
        if (this.balls.length === 1) {
            this.animationTick()
        }
    }

    /**
     *  - On tick, apply direction vector to position vector across all balls
     *  - Add some gravity to drift elements down to the bottom
     *  - If ball hits floor, apply the bouncing CSS effect
     *  - Map cartesian x,y to document based x,y and apply to position of ball element
     */
    animationTick() {
        this.balls.forEach((ball: Ball) => {
            let positionUpdate: Vector2D,
                documentPositionUpdate: Vector2D;
            ball.reachedFloor = TrigUtils.testFloor(ball, this.floor);
            if (ball.reachedFloor) {
                ball.velocity = new Vector2D(0, 0);
                ball.elem.classList.add('bounce');
                return;
            }
            ball.velocity = TrigUtils.testSides(ball, this.leftLimit, this.rightLimit);
            ball.velocity = TrigUtils.testCeiling(ball, this.ceiling);
            positionUpdate = TrigUtils.addVectors(ball.position, ball.velocity);
            positionUpdate.y -= GRAVITY_COEFFICIENT; // add gravity effect
            ball.position = positionUpdate;
            documentPositionUpdate = TrigUtils.mapCartesianToDocument(positionUpdate, this.halfWidth, this.halfHeight);
            ball.elem.style.left = documentPositionUpdate.x + 'px';
            ball.elem.style.top = documentPositionUpdate.y + 'px';
        });
        window.requestAnimationFrame(() => this.animationTick());
    }
}
