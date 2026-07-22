export function createStore(initialState) {
  let state = structuredClone(initialState);
  const listeners = new Set();

  return {
    getState: () => structuredClone(state),
    setState(patch) {
      state = { ...state, ...patch };
      listeners.forEach(fn => fn(structuredClone(state)));
    },
    reset() {
      state = structuredClone(initialState);
      listeners.forEach(fn => fn(structuredClone(state)));
    },
    subscribe(fn) {
      listeners.add(fn);
      fn(structuredClone(state));
      return () => listeners.delete(fn);
    }
  };
}
