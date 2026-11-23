/**
 * Standard data format specified:
 * {
 *   "problem": "string",
 *   "solution_1": "md format string",
 *   "solution_2": "md format string",
 *   "judge": {
 *     "solution_1_score": 8.5,
 *     "solution_2_score": 9.4,
 *     "solution_1_reasoning": "string",
 *     "solution_2_reasoning": "string"
 *   }
 * }
 */

export const INITIAL_MESSAGES = [
  {
    id: "msg-1",
    timestamp: "10:24 AM",
    problem: "Write an efficient factorial function in JavaScript that handles large numbers safely.",
    model_1: "Gemini 1.5 Pro (Model Alpha)",
    model_2: "GPT-4o (Model Beta)",
    judge_model: "Claude 3.5 Opus (Analytical Judge)",
    solution_1: `### Approach 1: Iterative Bottom-Up with BigInt

This solution calculates factorial using an iterative loop and JavaScript's native \`BigInt\` to avoid the 64-bit float IEEE-754 precision limit ($2^{53} - 1$).

\`\`\`javascript
/**
 * Computes factorial of n using BigInt to prevent integer overflow
 * @param {number|bigint} n 
 * @returns {bigint}
 */
function factorialIterative(n) {
  const num = BigInt(n);
  if (num < 0n) {
    throw new RangeError("Factorial is not defined for negative integers.");
  }
  if (num === 0n || num === 1n) {
    return 1n;
  }

  let result = 1n;
  for (let i = 2n; i <= num; i++) {
    result *= i;
  }
  return result;
}

// Example usage:
console.log(factorialIterative(25)); 
// Output: 15511210043330985984000000n
\`\`\`

#### Complexity Analysis:
- **Time Complexity:** $O(n)$ scalar multiplications.
- **Space Complexity:** $O(1)$ auxiliary memory (only requires tracking the running accumulator).
- **Stack Safety:** Completely immune to call-stack overflow errors even for $n > 50,000$.`,

    solution_2: `### Approach 2: Recursive with Memoization Cache

This solution uses recursion with a \`Map\` memoization cache to speed up repeated queries, accompanied by input validation.

\`\`\`javascript
const memo = new Map([
  [0n, 1n],
  [1n, 1n]
]);

function factorialMemoized(n) {
  const num = BigInt(n);
  if (num < 0n) {
    throw new RangeError("Negative numbers do not possess factorials.");
  }

  if (memo.has(num)) {
    return memo.get(num);
  }

  // Recursive step with memoization storage
  const result = num * factorialMemoized(num - 1n);
  memo.set(num, result);
  return result;
}

// Example:
console.log(factorialMemoized(20)); // 2432902008176640000n
\`\`\`

#### Trade-offs:
- **Time Complexity:** $O(1)$ for cached lookups, $O(n)$ for first computation.
- **Space Complexity:** $O(n)$ auxiliary memory in the memoization table.
- **Limitation:** Call stack overflow will trigger for $n > 8,000$ in standard V8 engines.`,

    judge: {
      solution_1_score: 9.2,
      solution_2_score: 7.8,
      solution_1_reasoning: "Solution 1 is production-grade. By choosing an iterative loop with BigInt, it delivers O(1) auxiliary space and completely eliminates the risk of call-stack exhaustion (Maximum call stack size exceeded) that plagues large values in V8.",
      solution_2_reasoning: "Solution 2 has good intent with memoization, but recursing down by n-1 fails the large number requirement: calling factorialMemoized(15000) causes an unrecoverable call-stack overflow before the memo cache can ever be completed."
    }
  },

  {
    id: "msg-2",
    timestamp: "10:28 AM",
    problem: "How to optimize recursive Fibonacci in JavaScript? Provide production-ready code with complexity analysis, handling large values of n without stack overflow.",
    model_1: "Claude 3.5 Sonnet (Model Alpha)",
    model_2: "GPT-4o (Model Beta)",
    judge_model: "Claude 3.5 Opus (Analytical Judge)",
    solution_1: `### Solution 1: Iterative State Swapping (Bottom-Up DP)

Instead of recalculating branches recursively, we store only the previous two Fibonacci terms in \`BigInt\` registers:

\`\`\`javascript
// Iterative DP with BigInt & O(1) auxiliary space
function fibonacciIterative(n) {
  if (n < 0) throw new RangeError("Index cannot be negative");
  if (n === 0) return 0n;
  if (n === 1) return 1n;
  
  let prev = 0n;
  let curr = 1n;
  for (let i = 2; i <= n; i++) {
    const next = prev + curr;
    prev = curr;
    curr = next;
  }
  return curr;
}

// Computes 100,000th Fibonacci number in ~120ms
console.log(fibonacciIterative(100).toString());
\`\`\`

- **Time Complexity:** $O(n)$ linear iterations.
- **Space Complexity:** $O(1)$ constant memory.
- **Pros:** Extremely readable, predictable garbage collection, zero stack frames.
- **Cons:** For $n = 1,000,000$, $10^6$ loop iterations require measurable time.`,

    solution_2: `### Solution 2: Fast Doubling Matrix Exponentiation $O(\\log n)$

Using matrix identity relationships, we calculate $F(2k)$ and $F(2k+1)$ from $F(k)$ and $F(k+1)$ in logarithmic time:

\`\`\`javascript
// Fast Doubling Matrix Exponentiation: O(log n)
function fibonacciLogN(n) {
  if (n < 0) throw new RangeError("Index cannot be negative");
  
  function fastDoubling(k) {
    if (k === 0) return [0n, 1n];
    const [a, b] = fastDoubling(Math.floor(k / 2));
    const c = a * (2n * b - a);        // F(2k)
    const d = a * a + b * b;            // F(2k + 1)
    return (k % 2 === 0) ? [c, d] : [d, c + d];
  }
  
  return fastDoubling(n)[0];
}

// Computes n = 1,000,000 in < 4ms!
console.log(fibonacciLogN(1000).toString());
\`\`\`

- **Time Complexity:** $O(\\log n)$ operations.
- **Space Complexity:** $O(\\log n)$ call-stack depth (for $n=1,000,000$, call depth is only $\\approx 20$ frames!).
- **Pros:** Astounding speed for astronomical numbers.
- **Cons:** Slightly higher mathematical overhead for trivial $n < 20$.`,

    judge: {
      solution_1_score: 8.6,
      solution_2_score: 9.5,
      solution_1_reasoning: "Solution 1 is very clean and readable. BigInt adoption avoids precision truncation and O(1) space is ideal. However, it scales linearly at O(n), which limits performance for high-throughput computing requested in the prompt.",
      solution_2_reasoning: "Solution 2 demonstrates master-level algorithmic engineering. The O(log n) fast-doubling matrix reduction solves the 1,000,000th Fibonacci number in under 4ms with call-stack depth capped to ~20 frames, fulfilling the large-scale optimization mandate."
    }
  }
];

export const PRESET_PROMPTS = [
  "Write an efficient factorial function in JavaScript that handles large numbers safely.",
  "How to optimize recursive Fibonacci in JavaScript with complexity analysis?",
  "Implement a debounce vs throttle function with TypeScript types in React 19.",
  "Compare SQL vs NoSQL indexing strategies for real-time analytics.",
  "How to implement a sliding-window rate limiter in Node.js with Redis?"
];

/**
 * Intelligent client-side fallback generator that always matches the exact data schema:
 * {
 *   problem: string,
 *   solution_1: string,
 *   solution_2: string,
 *   judge: { solution_1_score, solution_2_score, solution_1_reasoning, solution_2_reasoning }
 * }
 */
export function generateSimulatedBattle(problem) {
  const p = problem.trim();
  const lower = p.toLowerCase();

  // Check if query is about debounce/throttle
  if (lower.includes("debounce") || lower.includes("throttle")) {
    return {
      problem: p,
      solution_1: `### Solution 1: Closure-Based Debounce with Immediate Execution Flag

A clean functional debounce implementation supporting trailing & leading edge triggers:

\`\`\`typescript
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  wait: number,
  immediate: boolean = false
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return function (this: any, ...args: Parameters<T>) {
    const callNow = immediate && !timer;
    
    if (timer) clearTimeout(timer);
    
    timer = setTimeout(() => {
      timer = null;
      if (!immediate) fn.apply(this, args);
    }, wait);

    if (callNow) fn.apply(this, args);
  };
}
\`\`\`

- **Key Benefits:** Full TypeScript parameter preservation, optional leading invocation, self-contained closure.`,

      solution_2: `### Solution 2: React 19 Custom Hook with AbortController Integration

Integrates natively with React lifecycle and \`useEffect\` teardown:

\`\`\`tsx
import { useEffect, useRef } from 'react';

export function useDebouncedCallback<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (...args: Parameters<T>) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      callbackRef.current(...args);
    }, delay);
  };
}
\`\`\`

- **Key Benefits:** Never causes memory leaks on unmount, always references latest props/state without re-triggering effects.`,

      judge: {
        solution_1_score: 8.4,
        solution_2_score: 9.3,
        solution_1_reasoning: "Solution 1 is a solid universal utility, but within React applications it requires manual ref synchronization or will retain stale closures across renders.",
        solution_2_reasoning: "Solution 2 is specifically adapted for React component lifecycles. useRef persistence for both timer and callback guarantees zero stale state traps and automatic unmount cleanup."
      }
    };
  }

  // Generic dynamic battle generator matching exact schema
  
  return {
    problem: p,
    solution_1: `### Solution 1: Direct & Idiomatic Approach

This solution focuses on developer ergonomics, clean separation of concerns, and industry standards:

\`\`\`javascript
// Solution 1 Implementation for: ${p.slice(0, 50)}...
export function executeStandardStrategy(input) {
  // 1. Guard clause and validation
  if (input === null || input === undefined) {
    throw new TypeError("Invalid input payload provided");
  }

  // 2. Core processing pipeline
  const sanitized = String(input).trim();
  const results = [];

  for (let i = 0; i < sanitized.length; i++) {
    results.push({ index: i, char: sanitized[i], timestamp: Date.now() });
  }

  return {
    success: true,
    count: results.length,
    data: results
  };
}
\`\`\`

#### Key Characteristics:
- **Clarity:** Low cognitive load, intuitive maintenance for collaborative teams.
- **Safety:** Explicit runtime validation and standard error handling.
- **Complexity:** $O(n)$ linear compute, $O(n)$ space.`,

    solution_2: `### Solution 2: High-Throughput & Optimized Micro-Architecture

This alternative prioritizes asymptotic scalability, reduced memory pressure, and zero allocations:

\`\`\`javascript
// Solution 2 High-Performance Pipeline
const BUFFER_CAPACITY = 1024 * 64; // 64KB pre-allocated chunk
const sharedBuffer = new Uint32Array(BUFFER_CAPACITY);

export function executeHighPerfStrategy(input) {
  // Fast-path bypass for trivial inputs
  if (!input) return { success: true, count: 0 };

  let pointer = 0;
  const len = input.length;

  // Unrolled loop for cache-locality and vectorization
  while (pointer < len - 3) {
    sharedBuffer[pointer] = input.charCodeAt(pointer);
    sharedBuffer[pointer + 1] = input.charCodeAt(pointer + 1);
    sharedBuffer[pointer + 2] = input.charCodeAt(pointer + 2);
    sharedBuffer[pointer + 3] = input.charCodeAt(pointer + 3);
    pointer += 4;
  }

  while (pointer < len) {
    sharedBuffer[pointer] = input.charCodeAt(pointer);
    pointer++;
  }

  return {
    success: true,
    processedBytes: len,
    peakAllocations: 0
  };
}
\`\`\`

#### Key Characteristics:
- **Efficiency:** Drastically reduced V8 garbage collector churn via reusable typed arrays.
- **Throughput:** Loop unrolling improves instruction-level parallelism.
- **Trade-off:** Requires careful lifecycle bounds management.`,

    judge: {
      solution_1_score: 8.8,
      solution_2_score: 9.1,
      solution_1_reasoning: `Solution 1 excels at readability and maintainability. For standard business microservices, its deterministic simplicity and zero esoteric mechanics make it easy to audit and debug.`,
      solution_2_reasoning: `Solution 2 delivers superior performance under high-concurrency workloads. By eliminating GC pauses and pre-allocating memory, it guarantees sub-millisecond tail latencies (p99). Winner for systems engineering.`
    }
  };
}
