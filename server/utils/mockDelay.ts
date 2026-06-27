/**
 * Mock delay function to simulate a delay in the server
 * @param ms - The delay in milliseconds
 * @returns A promise that resolves after the delay
 */
export default function mockDelay(ms: number = 3000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
