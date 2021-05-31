import React, { useContext, useLayoutEffect, useReducer } from 'react';

const Context = React.createContext();

export const connect = (
  mapStateToProps,
  mapDispatchToProps,
) => WrappedComponent => props => {
  const store = useContext(Context);
  const { getState, dispatch, subscribe } = store;

  // 依据mapStateToProps 生成需要传递的store
  const storePorps = mapStateToProps(getState());
  
  let dispatchProps = { dispatch };

  // mapDispatchToProps 可以为function 或 object
  if (typeof mapDispatchToProps === 'function') {
    dispatchProps = mapDispatchToProps(dispatch);
  }

  if (typeof mapDispatchToProps === 'object') {
    dispatchProps = bindActionCreators(mapDispatchToProps, dispatch);
  }

  // 用于刷新页面 该数据无实际用途
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  useLayoutEffect(() => {
    const unsubscribe = subscribe(() => {
      forceUpdate();
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [store]);


  return <WrappedComponent {...props} {...storePorps} {...dispatchProps} />;
}

export function Provider ({ store, children }) {
  return <Context.Provider value={store}>{children}</Context.Provider>
};

function bindActionCreator(creator, dispatch) {
  return (...args) => dispatch(creator(...args));

};

export function bindActionCreators (creators, dispatch) {
  const obj = {};
  for (let key in creators) {
    obj[key] = bindActionCreator(creators[key], dispatch);
  }
};

export function useSelector(slector) {

}


export function useDispatch() {
  const store = useStore();
  return store.dispatch;
}

function useStore() {
  const store = useContext(Context);
  return store;
}