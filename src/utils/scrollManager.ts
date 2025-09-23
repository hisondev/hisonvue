let holders = new Set<string>();              // Active lock holders (modal ids)
let originalOverflow: string | null = null;   // Stores the original overflow before first lock

function applyDesiredOverflow() {
  // Apply correct overflow state:
  // - If at least one holder → force hidden
  // - If none → restore original overflow
  if (holders.size > 0) {
    if (document.documentElement.style.overflow !== 'hidden') {
      document.documentElement.style.overflow = 'hidden';
    }
  } else {
    document.documentElement.style.overflow = originalOverflow ?? '';
    originalOverflow = null;
  }
}

/**
 * Acquire a scroll lock for a given key (usually modal id).
 * - First call stores the original overflow value.
 * - Multiple calls with the same key are safe (Set prevents duplicates).
 */
export function acquireScrollLock(key: string) {
  if (!key) key = '__unknown__';

  if (holders.size === 0) {
    // Save original overflow only on the very first acquire
    originalOverflow = document.documentElement.style.overflow || '';
  }

  holders.add(key);
  applyDesiredOverflow();
}

/**
 * Release a scroll lock for a given key.
 * - Safe to call even if the key was not holding a lock.
 */
export function releaseScrollLock(key: string) {
  if (!key) key = '__unknown__';

  holders.delete(key);
  applyDesiredOverflow();
}

/**
 * Emergency reset.
 * - Clears all lock holders and restores the original overflow value.
 */
export function resetScrollLock() {
  holders.clear();
  applyDesiredOverflow();
}

/**
 * Get the list of current lock holder keys.
 * - Useful for debugging or checking active modal ids.
 */
export function getScrollLockHolders(): string[] {
  return Array.from(holders);
}
