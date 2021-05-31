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
    currentListeners.forEach(listener => listener());
    return action;
  }

  function subscribe(listener) {
    currentListeners.push(listener);
    let isSubscribed = true;


    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      };
      isSubscribed = false;

      const index = currentListeners.indexOf(listener);
      // 过滤暂未实现
      currentListeners.splice(index, 1);
    };
  }
  // 初始化store
  dispatch({type: "REDUX/KKKB"});

  return {
    getState,
    dispatch,
    subscribe
  };
}

export default createStore;
