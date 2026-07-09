let holders = new Set<string>();              // Active lock holders (modal ids)
let originalOverflow: string | null = null;   // Stores the original overflow before first lock
let originalBodyOverflow: string | null = null;
let originalBodyOverscroll: string | null = null;

function applyDesiredOverflow() {
  // Apply correct overflow state:
  // - If at least one holder → force hidden
  // - If none → restore original overflow
  // html alone is not enough on iOS Safari — lock body as well and contain
  // overscroll so the page behind an overlay doesn't rubber-band.
  // (Not a 100% iOS guarantee; the full position:fixed technique is too
  //  invasive for a library default.)
  if (holders.size > 0) {
    if (document.documentElement.style.overflow !== 'hidden') {
      document.documentElement.style.overflow = 'hidden';
    }
    if (document.body.style.overflow !== 'hidden') {
      document.body.style.overflow = 'hidden';
    }
    if ((document.body.style as any).overscrollBehavior !== 'contain') {
      (document.body.style as any).overscrollBehavior = 'contain';
    }
  } else {
    document.documentElement.style.overflow = originalOverflow ?? '';
    document.body.style.overflow = originalBodyOverflow ?? '';
    (document.body.style as any).overscrollBehavior = originalBodyOverscroll ?? '';
    originalOverflow = null;
    originalBodyOverflow = null;
    originalBodyOverscroll = null;
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
    // Save original values only on the very first acquire
    originalOverflow = document.documentElement.style.overflow || '';
    originalBodyOverflow = document.body.style.overflow || '';
    originalBodyOverscroll = (document.body.style as any).overscrollBehavior || '';
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
