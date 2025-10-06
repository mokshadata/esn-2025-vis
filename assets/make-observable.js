function useObservable(initialState, compute) {
  const eventHandlers = {
    onValueChange: []
  };
 
  function addChangeListener(callback) {
    eventHandlers.onValueChange.push(callback);
  }

  const observable = new Proxy(initialState, {
    set(target, property, value, receiver) {
      const previousValue = target[property];
      const result = Reflect.set(target, property, value, receiver);
      if (result && previousValue !== value) {
        eventHandlers.onValueChange.forEach(handler => handler({ property, value, previousValue, target }));
      }
      return result;
    },
    get(target, prop, receiver) {
      if (Object.keys(initialState).includes(prop)) {
        return Reflect.get(...arguments)
      }
      return compute(...arguments)
    },
  });

  return {
    observable,
    addChangeListener,
  }
}