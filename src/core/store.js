export function createStore(initialState) {
  let state = structuredClone(initialState);
  const listeners = new Set();

  return {
    getState() {
      return structuredClone(state);
    },
    setState(patch) {
      state = { ...state, ...patch };
      listeners.forEach(listener => listener(this.getState()));
    },
    reset() {
      state = structuredClone(initialState);
      listeners.forEach(listener => listener(this.getState()));
    },
    subscribe(listener) {
      listeners.add(listener);
      listener(this.getState());
      return () => listeners.delete(listener);
    }
  };
}
