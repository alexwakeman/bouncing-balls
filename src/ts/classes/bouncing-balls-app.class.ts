import { Animate } from './animate.class';

export class BouncingBallsApp {
    init() {
        const boundingBox = <HTMLScriptElement>document.querySelector('.bounding-box');
        let animate: Animate;
        boundingBox.style.height = window.innerHeight + 'px';
        animate = new Animate(boundingBox);
        boundingBox.addEventListener('click', (evt: MouseEvent) => animate.addBall(evt));
    }
}
