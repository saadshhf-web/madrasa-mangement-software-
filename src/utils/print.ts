/**
 * Browser Print Utility
 */

export function triggerPrint(): void {
  // Delay slightly if needed to ensure DOM rendering has finished
  setTimeout(() => {
    window.print();
  }, 100);
}
