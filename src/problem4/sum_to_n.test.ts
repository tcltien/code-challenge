import { test, describe } from 'node:test';
import assert from 'node:assert';
import { sum_to_n_a, sum_to_n_b, sum_to_n_c } from './sum_to_n';

const methods = [
    { name: 'Implementation A (Loop)', fn: sum_to_n_a },
    { name: 'Implementation B (Math)', fn: sum_to_n_b },
    { name: 'Implementation C (Recursion)', fn: sum_to_n_c },
];

methods.forEach(({ name, fn }) => {
    describe(`Test cases for ${name}`, () => {
        test('should return 15 for n = 5', () => {
            assert.strictEqual(fn(5), 15);
        });

        test('should return 5050 for n = 100', () => {
            assert.strictEqual(fn(100), 5050);
        });

        test('should handle edge case n = 0 by returning 0', () => {
            assert.strictEqual(fn(0), 0);
        });

        test('should handle negative input gracefully by returning 0', () => {
            assert.strictEqual(fn(-10), 0);
        });
    });
});