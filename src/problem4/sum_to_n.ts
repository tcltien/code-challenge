/**
 * Approach A: Iterative Loop
 * Computes the sum of numbers from 1 to n using a classic `for` loop.
 * * @time-complexity O(n) - Linear time relative to the value of n.
 * @space-complexity O(1) - Constant space used for accumulator and iterator variables.
 */
export function sum_to_n_a(n: number): number {
    if (n <= 0) return 0;
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
}

/**
 * Approach B: Mathematical Formula (Arithmetic Progression)
 * Computes the sum of numbers from 1 to n using Gauss's formula: n * (n + 1) / 2.
 * * @time-complexity O(1) - Constant time as it only requires 3 basic arithmetic operations.
 * @space-complexity O(1) - Optimal space, no additional allocations.
 */
export function sum_to_n_b(n: number): number {
    if (n <= 0) return 0;
    return (n * (n + 1)) / 2;
}

/**
 * Approach C: Recursive Call Stack
 * Computes the sum of numbers from 1 to n using recursion.
 * * @time-complexity O(n) - Makes n recursive function calls.
 * @space-complexity O(n) - Allocates n call stack frames. Risk of Stack Overflow for large n.
 */
export function sum_to_n_c(n: number): number {
    if (n <= 0) return 0;
    return n + sum_to_n_c(n - 1);
}