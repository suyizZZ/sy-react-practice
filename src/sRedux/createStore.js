function createStore(reducer, enhancer) {
  if (enhancer) {
    return enhancer(createStore)(reducer);
  }
  let currentState;
  let currentListeners = [];
  function getState() {
    return currentState;
  }

  function dispatch(action) {
    currentState = reducer(currentState, action);
    currentListeners.forEach((linstenr) => linstenr());
  }

  function subscribe(listener) {
    currentListeners.push(listener);
    let isSubscribed = false;
    return () => {
      if (isSubscribed) {
        return;
      }

      const index = currentListeners.indexOf(listener);
      currentListeners.splice(index, 1);
      isSubscribed = true;
    };
  }
  // 初始化store
  dispatch({ type: 'REDUX/KKKB' });

  return {
    getState,
    dispatch,
    subscribe,
  };
}

export default createStore;
