import { Vector2D } from './vector.class';

export class Ball {
    // actual position in box
    position: Vector2D;
    radius: number; // radius of circle

    // polar coordinates of direction
    velocity: Vector2D;

    // the DOM elem
    elem: HTMLElement;

    // indicates the ball has touched the bottom of window
    reachedFloor: boolean;
}
