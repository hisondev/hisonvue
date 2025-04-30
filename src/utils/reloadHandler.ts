const reloadHandlers = new Map<string, () => void>()

export const registerReloadable = (id: string, fn: () => void) => {
  reloadHandlers.set(id, fn)
}

export const unregisterReloadable = (id: string) => {
  reloadHandlers.delete(id)
}

export const reloadAllHisonComponents = () => {
  for (const fn of reloadHandlers.values()) {
    fn()
  }
}
