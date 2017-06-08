import { TrigUtils } from '../trig-utils.class';
import { Vector2D } from "../../models/vector.class";
import { Ball } from "../../models/ball.class";

describe('TrigUtils', function() {
	describe('mapping functions', () => {
		const boundedHalfWidth = 50;
		const boundedHalfHeight = 50;
		const clickX = 10;
		const clickY = 0;
		const cartesianX = -40;
		const cartesianY = 50;

		describe('mapDocumentToCartesian', () => {
			it('should convert click co-ordinates to cartesian', function() {
				const mapped = TrigUtils.mapDocumentToCartesian(new Vector2D(clickX, clickY), boundedHalfWidth, boundedHalfHeight);
				expect(mapped.x).toEqual(cartesianX);
				expect(mapped.y).toEqual(cartesianY);
			});
		});
		describe('mapCartesianToDocument', () => {
			it('should convert click co-ordinates to cartesian', function() {
				const mapped = TrigUtils.mapCartesianToDocument(new Vector2D(cartesianX, cartesianY), boundedHalfWidth, boundedHalfHeight);
				expect(mapped.x).toEqual(clickX);
				expect(mapped.y).toEqual(clickY);
			});
		});
	});

	describe('addVectors', () => {
		it('should add two vectors up correctly', () => {
			const sum = TrigUtils.addVectors(new Vector2D(10, 10), new Vector2D(5, 5));
			expect(sum.x).toEqual(15);
			expect(sum.y).toEqual(15);
		})
	});

	describe('getRandom', () => {
		it('should not return two numbers the same', () => {
			const rand1 = TrigUtils.getRandom();
			const rand2 = TrigUtils.getRandom();
			expect(rand1).not.toEqual(rand2);
		});
	});

	describe('boundary tests', () => {
		const ball = new Ball();
		const leftLimit = -10;
		const rightLimit = 10;
		ball.radius = 1;
		ball.velocity = new Vector2D(1, 0);
		describe('testSides', () => {
			it('should reflect the initial position vector if over the left side limit', () => {
				let reflected: Vector2D;
				ball.position = new Vector2D(leftLimit - 10, 0);
				reflected = TrigUtils.testSides(ball, leftLimit, rightLimit);
				expect(reflected.x).toEqual(-ball.velocity.x);
				expect(reflected.y).not.toEqual(ball.velocity.y);
			});
			it('should reflect the initial position vector if over the right side limit', () => {
				let reflected: Vector2D;
				ball.position = new Vector2D(rightLimit + 10, 0);
				reflected = TrigUtils.testSides(ball, leftLimit, rightLimit);
				expect(reflected.x).toEqual(-ball.velocity.x);
				expect(reflected.y).not.toEqual(ball.velocity.y);
			});
			it('should return same vector values if within bounds', () => {
				let reflected: Vector2D;
				ball.position = new Vector2D(0, 0);
				reflected = TrigUtils.testSides(ball, leftLimit, rightLimit);
				expect(reflected.x).toEqual(ball.velocity.x);
				expect(reflected.y).toEqual(ball.velocity.y);
			});
		});
	});

	describe('testCeiling', () => {
		const ball = new Ball();
		const ceiling = 10;
		ball.radius = 1;
		ball.velocity = new Vector2D(1, 0);
		it('should invert the velocity y axis if ball is above the top', () => {
			let testVector: Vector2D;
			ball.position = new Vector2D(0, ceiling + 10);
			testVector = TrigUtils.testCeiling(ball, ceiling);
			expect(testVector.y).toEqual(-ball.velocity.y);
		});
		it('should not invert the velocity y axis if ball is within the top bounds', () => {
			let testVector: Vector2D;
			ball.position = new Vector2D(0, ceiling - 10);
			testVector = TrigUtils.testCeiling(ball, ceiling);
			expect(testVector.y).toEqual(ball.velocity.y);
		});
	});

	describe('testFloor', () => {
		const ball = new Ball();
		const floor = -10;
		ball.radius = 1;
		it('should return true if y position is under the floor boundary', () => {
			let result: boolean;
			ball.position = new Vector2D(0, floor - 10);
			result = TrigUtils.testFloor(ball, floor);
			expect(result).toEqual(true);
		});
		it('should return false if y position is above the floor boundary', () => {
			let result: boolean;
			ball.position = new Vector2D(0, floor + 10);
			result = TrigUtils.testFloor(ball, floor);
			expect(result).toEqual(false);
		});
	});
});