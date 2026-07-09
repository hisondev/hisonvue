const reloadHandlers = new Map<string, () => void>()
const restyleHandlers = new Map<string, () => void>()

export const registerReloadable = (id: string, fn: () => void) => {
  reloadHandlers.set(id, fn)
}

export const unregisterReloadable = (id: string) => {
  reloadHandlers.delete(id)
}

/**
 * Registers a lightweight "restyle" handler.
 * Restyle handlers re-apply colors/theme to an already mounted component
 * WITHOUT destroying it (no data/undo/cursor loss).
 * Components that are fully styled by CSS variables do not need one.
 */
export const registerRestyle = (id: string, fn: () => void) => {
  restyleHandlers.set(id, fn)
}

export const unregisterRestyle = (id: string) => {
  restyleHandlers.delete(id)
}

export const reloadAllHisonComponents = () => {
  for (const fn of [...reloadHandlers.values()]) {
    fn()
  }
}

/**
 * Re-applies theme colors in place. Used by hison.style color setters
 * (setPrimaryColor, setInvertColor, ...) so grids/notes/charts/calendars
 * keep their state instead of being remounted.
 */
export const restyleAllHisonComponents = () => {
  for (const fn of [...restyleHandlers.values()]) {
    fn()
  }
}

export const reloadHisonComponent = (id: string) => {
  const fn = reloadHandlers.get(id)
  if (fn) fn()
}
