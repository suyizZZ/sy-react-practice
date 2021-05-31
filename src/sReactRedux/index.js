import React from 'react';

const Context = React.createContext();

export function Provider ({ store, children }) {
  return <Context.Provider value={store}>{children}</Context.Provider>
};